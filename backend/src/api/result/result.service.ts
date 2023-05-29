import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadScoreDto } from 'src/dtos/score.dto';
import {
  DiagnosticResult,
  Label,
  Model,
  Record,
  Score,
} from 'src/schema/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ResultService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(DiagnosticResult)
    private readonly resultRepo: Repository<DiagnosticResult>,
    @InjectRepository(Label) private readonly labelRepo: Repository<Label>,
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
    @InjectRepository(Model) private readonly modelRepo: Repository<Model>,
    @InjectRepository(Score) private readonly scoreRepo: Repository<Score>,
  ) {}

  async getLabels() {
    return await this.labelRepo.find();
  }

  async createLabel(labelName: string) {
    const label = this.labelRepo.create({ labelName });
    return await this.labelRepo.save(label);
  }

  async removeLabel(labelId: string) {
    const label = await this.labelRepo.findOneBy({ labelId });
    return await this.labelRepo.remove(label);
  }

  async getResults() {
    return await this.resultRepo.find({
      relations: ['record', 'record.device', 'model', 'scores', 'scores.label'],
    });
  }

  async diagnostic(recordId: string, modelId: string) {
    // TODO: get results from AI module
    const lables = await this.getLabels();
    const scores: UploadScoreDto[] = lables.map((l) => ({
      labelId: l.labelId,
      score: Math.random(),
    }));
    return await this.uploadScores(recordId, modelId, scores);
  }

  async uploadScores(
    recordId: string,
    modelId: string,
    scores: UploadScoreDto[],
  ) {
    const record = await this.recordRepo.findOneBy({ recordId });
    const model = await this.modelRepo.findOneBy({ modelId });

    const result = this.resultRepo.create({
      record,
      model,
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
      .getMany();
    res.scores = sc;

    return res;
  }

  async removeResult(resultId: string) {
    const result = await this.resultRepo.findOneBy({ resultId });
    return await this.resultRepo.remove(result);
  }
}
