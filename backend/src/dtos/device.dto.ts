import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Device } from 'src/schema/entities/device.entity';
import { QueryParamsDto } from './query-params.dto';

export class DeviceDto {
  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  password: string;

  public static toHashPassword(user: ThisType<DeviceDto>) {
    let obj: any = { ...user };
    if (obj.password) obj.hashPassword = obj.password;
    delete obj.password;
    return obj as PartialDevice;
  }
}

export class DeviceUpdateDto extends PartialType(DeviceDto) {
  @ApiProperty()
  currentModel: string;
}
export class PartialDevice extends PartialType(Device) {}

export class ListDeviceParams extends QueryParamsDto {
  @ApiProperty({ required: false })
  deviceName: string;

  @ApiProperty({ required: false })
  currentModel: string;
}
