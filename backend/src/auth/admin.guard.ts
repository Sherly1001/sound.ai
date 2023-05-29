import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';
import { UserGuard } from './user.guard';

@Injectable()
export class AdminGuard extends UserGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const payload = request['user'] as AuthUserPayload;
    if (!payload || !payload.isAdmin) {
      throw new UnauthorizedException('not admin');
    }

    return true;
  }
}
