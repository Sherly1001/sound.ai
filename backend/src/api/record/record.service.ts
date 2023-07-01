import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListRecordParams, RecordUploadDto } from 'src/dtos/record.dto';
import { Device, Record } from 'src/schema/entities';
import { StorageService } from 'src/storage/storage.service';
import { sqlContains, sqlNumberRange } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
  ) {}

  async getRecords(params: ListRecordParams) {
    const query = this.recordRepo.createQueryBuilder().setParameters(params);

    if (params.beforeAt) {
      query.andWhere('Record.timestamp <= :beforeAt::timestamptz');
    }

    if (params.afterAt) {
      query.andWhere('Record.timestamp >= :afterAt::timestamptz');
    }

    if (params.deviceName) {
      sqlContains(query, 'Device.deviceName', 'deviceName');
    }

    if (params.temperature) {
      sqlNumberRange(query, 'Record.temperature', 'temperature');
    }

    if (params.humidity) {
      sqlNumberRange(query, 'Record.humidity', 'humidity');
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

    query.leftJoinAndSelect('Record.device', 'Device');

    if (params.getResults && params.getResults == 'true') {
      query.leftJoinAndSelect('Record.results', 'DiagnosticResult');
      query.leftJoinAndSelect('DiagnosticResult.model', 'Model');
      query.leftJoinAndSelect('DiagnosticResult.scores', 'Score');
      query.leftJoinAndSelect('DiagnosticResult.diagnosticByUser', 'User');
      query.leftJoinAndSelect(
        'DiagnosticResult.diagnosticByDevice',
        'ResultDevice',
      );
      query.leftJoinAndSelect('Model.type', 'ModelType');
      query.leftJoinAndSelect('Score.label', 'Label');
    }

    return await query.getManyAndCount();
  }

  async getRecord(recordId: string) {
    const query = this.recordRepo
      .createQueryBuilder()
      .where('Record.recordId = :recordId', { recordId })
      .leftJoinAndSelect('Record.device', 'Device')
      .leftJoinAndSelect('Record.results', 'DiagnosticResult')
      .leftJoinAndSelect('DiagnosticResult.model', 'Model')
      .leftJoinAndSelect('DiagnosticResult.scores', 'Score')
      .leftJoinAndSelect('DiagnosticResult.diagnosticByUser', 'User')
      .leftJoinAndSelect('DiagnosticResult.diagnosticByDevice', 'ResultDevice')
      .leftJoinAndSelect('Model.type', 'ModelType')
      .leftJoinAndSelect('Score.label', 'Label');

    return await query.getOne();
  }

  async uploadRecord(
    deviceId: string,
    audioFile: Express.Multer.File,
    imageFile: Express.Multer.File,
    payload: RecordUploadDto,
  ) {
    const audioFilePath = await this.storageService.saveAudio(audioFile);
    const imageFilePath = await this.storageService.saveImage(imageFile);
    try {
      const device = await this.deviceRepo.findOneBy({ deviceId });
      const rec = this.recordRepo.create({
        device,
        ...payload,
        audioFilePath,
        imageFilePath,
      });
      return await this.recordRepo.save(rec);
    } catch (err) {
      this.storageService.removeAudio(audioFilePath);
      this.storageService.removeImage(imageFilePath);
      throw err;
    }
  }

  async delete(recordId: string) {
    const rec = await this.recordRepo.findOneBy({ recordId });
    return await this.recordRepo.remove(rec);
  }
}
