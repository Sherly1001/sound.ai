import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from 'src/schema/entities/user.entity';

export class UserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  public static toHashPassword(user: ThisType<UserDto>) {
    let obj: any = { ...user };
    obj.hashPassword = obj.password;
    delete obj.password;
    return obj as PartialUser;
  }
}

export class UserUpdateDto extends PartialType(UserDto) {}
export class PartialUser extends PartialType(User) {}