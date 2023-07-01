import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { User } from 'src/schema/entities/user.entity';
import { QueryParamsDto } from './query-params.dto';

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

export class ListUserParams extends OmitType(QueryParamsDto, [
  'beforeAt',
  'afterAt',
]) {
  @ApiProperty({ required: false })
  username: string;

  @ApiProperty({ type: 'boolean', required: false })
  isAdmin: string;
}
