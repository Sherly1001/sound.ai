import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from 'src/schema/entities/user.entity';

export class UserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  public static toHashPassword(user: ThisType<UserDto>) {
    let obj: any = { ...user };
    if (obj.password) obj.hashPassword = obj.password;
    delete obj.password;
    return obj as PartialUser;
  }
}

export class UserUpdateDto extends PartialType(UserDto) {
  @ApiProperty()
  currentPassword: string;
}

export class PartialUser extends PartialType(User) {
  @ApiProperty()
  currentPassword: string;
}
