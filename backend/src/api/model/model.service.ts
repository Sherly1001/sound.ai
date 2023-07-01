import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { ListModelParams, ListModelTypeParams } from 'src/dtos/model.dto';
import { Model, ModelType } from 'src/schema/entities';
import { StorageService } from 'src/storage/storage.service';
import { sqlContains } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Model) private readonly modelRepo: Repository<Model>,
    @InjectRepository(ModelType)
    private readonly modelTypeRepo: Repository<ModelType>,
  ) {}

  async getModels(params: ListModelParams) {
    const query = this.modelRepo.createQueryBuilder().setParameters(params);

    if (params.beforeAt) {
      query.andWhere('Model.timestamp <= :beforeAt::timestamptz');
    }

    if (params.afterAt) {
      query.andWhere('Model.timestamp >= :afterAt::timestamptz');
    }

    if (params.modelName) {
      sqlContains(query, 'Model.modelName', 'modelName');
    }

    if (params.modelType) {
      sqlContains(query, 'ModelType.typeName', 'modelType');
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

    query.leftJoinAndSelect('Model.type', 'ModelType');

    return await query.getManyAndCount();
  }

  async getModelTypes(params: ListModelTypeParams) {
    const query = this.modelTypeRepo.createQueryBuilder().setParameters(params);

    if (params.modelType) {
      sqlContains(query, 'ModelType.typeName', 'modelType');
    }

    if (params.page > 0) {
      query.skip(params.limit * (params.page - 1));
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.orderBy) {
      const asc = params.orderASC ? params.orderASC == 'true' : true;
      query.orderBy('ModelType.' + params.orderBy, asc ? 'ASC' : 'DESC');
    }

    return await query.getManyAndCount();
  }

  async createModelType(typeName: string) {
    const type = this.modelTypeRepo.create({ typeName });
    return await this.modelTypeRepo.save(type);
  }

  async removeModelType(typeId: string) {
    const type = await this.modelTypeRepo.findOneBy({ typeId });
    return await this.modelTypeRepo.remove(type);
  }

  async downloadModel(modelId: string): Promise<[string, Buffer]> {
    const model = await this.modelRepo.findOneBy({ modelId });
    if (!model) {
      throw new NotFoundException(`ModelId ${modelId} not found`);
    }

    const name = model.modelName + path.extname(model.modelFilePath);
    const data = await this.storageService.getModel(model.modelFilePath);

    return [name, data];
  }

  async uploadModel(
    modelName: string,
    typeId: string,
    file: Express.Multer.File,
  ) {
    const modelFilePath = await this.storageService.saveModel(file);
    try {
      const type = await this.modelTypeRepo.findOneBy({ typeId });
      const model = this.modelRepo.create({ modelName, type, modelFilePath });
      return await this.modelRepo.save(model);
    } catch (err) {
      this.storageService.removeModel(modelFilePath);
      throw err;
    }
  }

  async removeModel(modelId: string) {
    const model = await this.modelRepo.findOneBy({ modelId });
    if (model) {
      await this.storageService.removeModel(model.modelFilePath);
      return await this.modelRepo.remove(model);
    }
    return null;
  }
}
