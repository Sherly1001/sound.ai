import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DeviceService } from 'src/api/device/device.service';
import { UserService } from 'src/api/user/user.service';
import { AuthDevicePayload } from 'src/dtos/auth-device-payload.dto';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly devService: DeviceService,
  ) {}

  async userLogin(username: string, password: string) {
    const user = await this.userService.verifyUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: AuthUserPayload = {
      userId: user.userId,
      isAdmin: user.isAdmin,
    };

    return await this.jwtService.signAsync(payload);
  }

  async devLogin(deviceName: string, password: string) {
    const dev = await this.devService.verifyDevice(deviceName, password);
    if (!dev) {
      throw new UnauthorizedException();
    }

    const payload: AuthDevicePayload = {
      deviceId: dev.deviceId,
    };

    return await this.jwtService.signAsync(payload);
  }
}
