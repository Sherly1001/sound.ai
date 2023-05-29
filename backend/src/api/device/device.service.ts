import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialDevice } from 'src/dtos/device.dto';
import { Device } from 'src/schema/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
  ) {}

  async getDevices() {
    return await this.deviceRepo.find({
      relations: ['currentModel', 'currentModel.type'],
    });
  }

  async create(deviceName: string, password: string) {
    const dev = this.deviceRepo.create({ deviceName, hashPassword: password });
    return await this.deviceRepo.save(dev);
  }

  async verifyDevice(deviceName: string, password: string) {
    const dev = await this.deviceRepo.findOneBy({ deviceName });
    if (!dev || !dev.checkPassword(password)) return null;
    return dev;
  }

  async updateDev(deviceId: string, payload: PartialDevice) {
    const dev = await this.deviceRepo.findOneBy({ deviceId });
    if (!dev) throw new NotFoundException(`DeviceId ${deviceId} not found`);
    const newDev = Object.assign(new Device(), { ...dev, ...payload });
    return await this.deviceRepo.save(newDev);
  }

  async deleteDev(deviceId: string) {
    const dev = await this.deviceRepo.findOneBy({ deviceId });
    return await this.deviceRepo.remove(dev);
  }
}
