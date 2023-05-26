import { ApiProperty } from '@nestjs/swagger';

export class AuthDevicePayload {
  @ApiProperty()
  deviceId: string;
}
