import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('missing token');
    }

    try {
      const payload: AuthUserPayload = await this.jwtService.verifyAsync(token);

      if (!payload.userId) {
        throw new UnauthorizedException('missing userId');
      }

      request['user'] = payload;
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
