import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListDeviceParams, PartialDevice } from 'src/dtos/device.dto';
import { Device } from 'src/schema/entities';
import { sqlContains } from 'src/utils';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
  ) {}

  async getDevices(params: ListDeviceParams) {
    const query = this.deviceRepo.createQueryBuilder().setParameters(params);

    if (params.beforeAt) {
      query.andWhere('Device.timestamp <= :beforeAt::timestamptz');
    }

    if (params.afterAt) {
      query.andWhere('Device.timestamp >= :afterAt::timestamptz');
    }

    if (params.deviceName) {
      sqlContains(query, 'Device.deviceName', 'deviceName');
    }

    if (params.currentModel) {
      query.andWhere(
        new Brackets((qb) => {
          sqlContains(qb, 'Model.modelName', 'currentModel', false);
          sqlContains(qb, 'ModelType.typeName', 'currentModel', false);
        }),
      );
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

    query.leftJoinAndSelect('Device.currentModel', 'Model');
    query.leftJoinAndSelect('Model.type', 'ModelType');

    return await query.getManyAndCount();
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
    if (!payload.hashPassword) delete dev.hashPassword;
    const newDev = Object.assign(new Device(), { ...dev, ...payload });
    return await this.deviceRepo.save(newDev);
  }

  async deleteDev(deviceId: string) {
    const dev = await this.deviceRepo.findOneBy({ deviceId });
    return await this.deviceRepo.remove(dev);
  }
}
