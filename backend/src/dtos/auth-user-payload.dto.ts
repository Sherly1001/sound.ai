import { ApiProperty } from '@nestjs/swagger';

export class AuthUserPayload {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  isAdmin: boolean;
}
