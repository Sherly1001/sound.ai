import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatisticDto } from 'src/dtos/statistic.dto';
import { Device, Model, Record, Score } from 'src/schema/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
    @InjectRepository(Model) private readonly modelRepo: Repository<Model>,
    @InjectRepository(Score) private readonly scoreRepo: Repository<Score>,
  ) {}

  async getSatistic(): Promise<StatisticDto> {
    const numDevices = await this.deviceRepo.count();
    const numModels = await this.modelRepo.count();

    const now = new Date();
    const prev = new Date();
    prev.setDate(now.getDate() - 30);

    const subQuery = this.recordRepo
      .createQueryBuilder()
      .select('Record.recordId')
      .andWhere('Record.timestamp <= :now::timestamptz')
      .andWhere('Record.timestamp >= :prev::timestamptz')
      .orderBy('Record.timestamp', 'DESC')
      .take(10)
      .getQuery();

    const [records, newRecords] = await this.recordRepo
      .createQueryBuilder()
      .setParameters({ now, prev })
      .andWhere(`Record.recordId in (${subQuery})`)
      .leftJoinAndSelect('Record.device', 'Device')
      .leftJoinAndSelect('Record.results', 'DiagnosticResult')
      .leftJoinAndSelect('DiagnosticResult.model', 'Model')
      .leftJoinAndSelect('DiagnosticResult.scores', 'Score')
      .leftJoinAndSelect('DiagnosticResult.diagnosticByUser', 'User')
      .leftJoinAndSelect('DiagnosticResult.diagnosticByDevice', 'ResultDevice')
      .leftJoinAndSelect('Model.type', 'ModelType')
      .leftJoinAndSelect('Score.label', 'Label')
      .orderBy('Record.timestamp', 'DESC')
      .addOrderBy('DiagnosticResult.timestamp', 'DESC')
      .addOrderBy('Label.labelName', 'ASC')
      .getManyAndCount();

    const res = (await this.scoreRepo
      .createQueryBuilder()
      .select('Score.label', 'label')
      .addSelect('avg(Score.score)', 'score')
      .groupBy('Score.label')
      .execute()) as { label: string; score: number }[];

    const point = res.reduce((acc, i) => acc + i.score, 0);
    const percentOk = (1 - point / res.length) * 100;

    return { records, newRecords, numDevices, numModels, percentOk };
  }
}
