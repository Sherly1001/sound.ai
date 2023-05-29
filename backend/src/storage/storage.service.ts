import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from 'src/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly pwd: string;
  private readonly dirs = {
    audio: 'audio',
    models: 'models',
    images: 'images',
  };

  constructor(private readonly cfg: ConfigService<AppConfig, true>) {
    this.pwd = path.join(
      process.cwd(),
      cfg.get('storage.dir', { infer: true }),
    );

    if (!fs.existsSync(this.pwd)) {
      fs.mkdirSync(this.pwd);
    }

    Object.values(this.dirs).forEach((dir) => {
      if (!fs.existsSync(path.join(this.pwd, dir))) {
        fs.mkdirSync(path.join(this.pwd, dir));
      }
    });
  }

  async listFiles(dir: string) {
    return fs.readdirSync(path.join(this.pwd, dir));
  }

  async listModels() {
    return await this.listFiles(this.dirs.models);
  }

  async getFile(filePath: string) {
    return fs.readFileSync(filePath);
  }

  async getModel(modelFileName: string) {
    const modelFilePath = path.join(this.pwd, this.dirs.models, modelFileName);
    return await this.getFile(modelFilePath);
  }

  async getAudio(audioFileName: string) {
    const audioFilePath = path.join(this.pwd, this.dirs.audio, audioFileName);
    return await this.getFile(audioFilePath);
  }

  async getImage(imageFileName: string) {
    const imageFilePath = path.join(this.pwd, this.dirs.images, imageFileName);
    return await this.getFile(imageFilePath);
  }

  async saveFile(dir: string, file: Express.Multer.File) {
    const fileName = randomUUID() + path.extname(file.originalname);
    const filePath = path.join(this.pwd, dir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    this.logger.debug(`saved file: ${filePath}`);
    return fileName;
  }

  async saveModel(file: Express.Multer.File) {
    return this.saveFile(this.dirs.models, file);
  }

  async saveAudio(file: Express.Multer.File) {
    return this.saveFile(this.dirs.audio, file);
  }

  async saveImage(file: Express.Multer.File) {
    return this.saveFile(this.dirs.images, file);
  }

  async removeFile(dir: string, name: string) {
    const filePath = path.join(this.pwd, dir, name);
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      this.logger.error(err);
    }
    this.logger.debug(`removed file: ${filePath}`);
  }

  async removeModel(modelFilePath: string) {
    return this.removeFile(this.dirs.models, modelFilePath);
  }

  async removeAudio(modelFilePath: string) {
    return this.removeFile(this.dirs.audio, modelFilePath);
  }

  async removeImage(modelFilePath: string) {
    return this.removeFile(this.dirs.images, modelFilePath);
  }
}
