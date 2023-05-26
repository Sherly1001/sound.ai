import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthDevicePayload } from 'src/dtos/auth-device-payload.dto';

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('missing token');
    }

    try {
      const payload: AuthDevicePayload = await this.jwtService.verifyAsync(
        token,
      );

      if (!payload.deviceId) {
        throw new UnauthorizedException('missing deviceId');
      }

      request['dev'] = payload;
    } catch (err) {
      throw new UnauthorizedException(err.toString());
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
