import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request['user'] as AuthUserPayload;
    if (!payload || !payload.isAdmin) {
      throw new UnauthorizedException('not admin');
    }

    return true;
  }
}
