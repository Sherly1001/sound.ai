import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordUploadDto } from 'src/dtos/record.dto';
import { Device } from 'src/schema/entities/device.entity';
import { Record } from 'src/schema/entities/record.entity';
import { StorageService } from 'src/storage/storage.service';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
  ) {}

  async getRecords() {
    return await this.recordRepo.find({
      relations: ['device'],
    });
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
