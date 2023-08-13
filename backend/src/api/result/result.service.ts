import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ListLabelParams,
  ListResultParams,
  UploadScoreDto,
} from 'src/dtos/score.dto';
import { MqttService } from 'src/mqtt/mqtt.service';
import {
  Device,
  DiagnosticResult,
  Label,
  Model,
  Record,
  Score,
  User,
} from 'src/schema/entities';
import { sqlContains, sqlNumberRange } from 'src/utils';
import { DataSource, Repository } from 'typeorm';
import { RecordService } from '../record/record.service';

@Injectable()
export class ResultService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly recordService: RecordService,
    private readonly dataSource: DataSource,
    @InjectRepository(DiagnosticResult)
    private readonly resultRepo: Repository<DiagnosticResult>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
    @InjectRepository(Label) private readonly labelRepo: Repository<Label>,
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
    @InjectRepository(Model) private readonly modelRepo: Repository<Model>,
    @InjectRepository(Score) private readonly scoreRepo: Repository<Score>,
  ) {}

  async getLabels(params: ListLabelParams) {
    const query = this.labelRepo.createQueryBuilder().setParameters(params);

    if (params.labelName) {
      sqlContains(query, 'Label.labelName', 'labelName');
    }

    if (params.page > 0) {
      query.skip(params.limit * (params.page - 1));
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.orderASC) {
      const asc = params.orderASC ? params.orderASC == 'true' : true;
      query.orderBy('Label.labelName', asc ? 'ASC' : 'DESC');
    }

    return await query.getManyAndCount();
  }

  async createLabel(labelName: string) {
    const label = this.labelRepo.create({ labelName });
    return await this.labelRepo.save(label);
  }

  async removeLabel(labelId: string) {
    const label = await this.labelRepo.findOneBy({ labelId });
    return await this.labelRepo.remove(label);
  }

  async getResults(params: ListResultParams) {
    const query = this.resultRepo.createQueryBuilder().setParameters(params);

    if (params.beforeAt) {
      query.andWhere('DiagnosticResult.timestamp <= :beforeAt::timestamptz');
    }

    if (params.afterAt) {
      query.andWhere('DiagnosticResult.timestamp >= :afterAt::timestamptz');
    }

    if (params.recordId) {
      query.andWhere('Record.recordId = :recordId');
    }

    if (params.deviceName) {
      sqlContains(query, 'Device.deviceName', 'deviceName');
    }

    if (params.modelName) {
      sqlContains(query, 'Model.modelName', 'modelName');
    }

    if (params.modelType) {
      sqlContains(query, 'ModelType.typeName', 'modelType');
    }

    if (params.labelName) {
      sqlContains(query, 'Label.labelName', 'labelName');
    }

    if (params.diagnosticByUser) {
      sqlContains(query, 'User.username', 'diagnosticByUser');
    }

    if (params.diagnosticByDevice) {
      sqlContains(query, 'ResultDevice.deviceName', 'diagnosticByDevice');
    }

    if (params.score) {
      sqlNumberRange(query, 'Score.score', 'score');
    }

    if (params.page > 0) {
      query.skip(params.limit * (params.page - 1));
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.orderBy) {
      const asc = params.orderASC ? params.orderASC == 'true' : true;
      query.orderBy(params.orderBy, asc ? 'ASC' : 'DESC');
    }

    query.leftJoinAndSelect('DiagnosticResult.record', 'Record');
    query.leftJoinAndSelect('DiagnosticResult.model', 'Model');
    query.leftJoinAndSelect('DiagnosticResult.scores', 'Score');
    query.leftJoinAndSelect('DiagnosticResult.diagnosticByUser', 'User');
    query.leftJoinAndSelect(
      'DiagnosticResult.diagnosticByDevice',
      'ResultDevice',
    );
    query.leftJoinAndSelect('Record.device', 'Device');
    query.leftJoinAndSelect('Model.type', 'ModelType');
    query.leftJoinAndSelect('Score.label', 'Label');

    return await query.getManyAndCount();
  }

  async diagnostic(
    recordId: string,
    modelId: string,
    byUserId: string = null,
    byDeviceId: string = null,
  ) {
    const record = await this.recordService.getRecord(recordId, false);

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const fft = await this.recordService.getFft(recordId);
    const res = (await this.mqttService.publishAndWait(
      MqttService.topicPredictReq,
      {
        modelId,
        record,
        fft,
      },
    )) as any;

    if (res.error) {
      throw new InternalServerErrorException(res.error);
    }

    return await this.uploadScores(
      recordId,
      modelId,
      res.data,
      byUserId,
      byDeviceId,
    );
  }

  async uploadScores(
    recordId: string,
    modelId: string,
    scores: UploadScoreDto[],
    byUserId: string = null,
    byDeviceId: string = null,
  ) {
    const record = await this.recordRepo.findOneBy({ recordId });
    const model = await this.modelRepo.findOneBy({ modelId });

    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    if (!model) {
      throw new NotFoundException('Model not found.');
    }

    const diagnosticByUser = byUserId
      ? await this.userRepo.findOneBy({
          userId: byUserId,
        })
      : null;
    const diagnosticByDevice = byDeviceId
      ? await this.deviceRepo.findOneBy({
          deviceId: byDeviceId,
        })
      : null;

    const result = this.resultRepo.create({
      record,
      model,
      diagnosticByUser,
      diagnosticByDevice,
      scores: scores.map((score) => ({
        score: score.score,
        label: {
          labelId: score.labelId,
        },
      })),
    });

    const res = await this.dataSource.transaction(async (mng) => {
      const res = await mng.save<DiagnosticResult>(result);
      const scrs = this.scoreRepo.create(
        scores.map(
          (sc) =>
            ({
              score: sc.score,
              label: sc.labelId,
              result: res.resultId,
            } as any),
        ),
      );
      await mng.save<Score>(scrs, { reload: false });
      return res;
    });

    const sc = await this.scoreRepo
      .createQueryBuilder()
      .leftJoinAndSelect('Score.label', 'Label')
      .where('Score.result = :resultId', { resultId: res.resultId })
      .addOrderBy('Label.labelName', 'ASC')
      .getMany();
    res.scores = sc;

    return res;
  }

  async removeResult(resultId: string) {
    const result = await this.resultRepo.findOneBy({ resultId });
    return await this.resultRepo.remove(result);
  }
}
