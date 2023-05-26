import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/api/user/user.service';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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
}
