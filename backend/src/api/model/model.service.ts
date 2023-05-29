import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelType } from 'src/schema/entities/model-type.entity';
import { Model } from 'src/schema/entities/model.entity';
import { StorageService } from 'src/storage/storage.service';
import { Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Model) private readonly modelRepo: Repository<Model>,
    @InjectRepository(ModelType)
    private readonly modelTypeRepo: Repository<ModelType>,
  ) {}

  async getModels() {
    return await this.modelRepo.find({ relations: ['type'] });
  }

  async getModelTypes() {
    return await this.modelTypeRepo.find();
  }

  async downloadModel(modelId: string) {
    const model = await this.modelRepo.findOneBy({ modelId });
    if (!model) {
      throw new NotFoundException(`ModelId ${modelId} not found`);
    }
    return await this.storageService.getModel(model.modelFilePath);
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
