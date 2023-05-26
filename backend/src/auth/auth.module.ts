import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DeviceModule } from 'src/api/device/device.module';
import { UserModule } from 'src/api/user/user.module';
import { AppConfig } from 'src/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => DeviceModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<AppConfig, true>) => ({
        global: true,
        secret: cfg.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: cfg.get('jwt.expiresIn', { infer: true }),
        },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
