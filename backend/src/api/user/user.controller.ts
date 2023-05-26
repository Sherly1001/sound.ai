import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserGuard } from 'src/auth/user.guard';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';
import { BaseResult } from 'src/dtos/base-result.dto';
import { UserDto, UserUpdateDto } from 'src/dtos/user.dto';
import { User } from 'src/schema/entities/user.entity';
import { UserService } from './user.service';

@ApiTags(UserController.name)
@ApiExtraModels(BaseResult, User, UserDto, UserUpdateDto)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
      properties: {
        data: { $ref: getSchemaPath(User) },
      },
    },
  })
  @Post('create')
  async createUser(@Res() res: Response, @Body() body: UserDto) {
    try {
      const result = await this.userService.createUser(
        body.username,
        body.password,
      );
      new BaseResult(result, HttpStatus.OK).toResponse(res);
    } catch (err) {
      new BaseResult(err).toResponse(res);
    }
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
    },
  })
  @Post('login')
  async login(@Res() res: Response, @Body() body: UserDto) {
    try {
      const token = await this.authService.userLogin(
        body.username,
        body.password,
      );
      new BaseResult(token).toResponse(res);
    } catch (err) {
      new BaseResult(err).toResponse(res);
    }
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
      properties: {
        data: { $ref: getSchemaPath(User) },
      },
    },
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth('userAuth')
  @Put('update')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UserUpdateDto,
  ) {
    try {
      const user: AuthUserPayload = req['user'];
      const result = await this.userService.updateUser(
        user.userId,
        UserDto.toHashPassword(body),
      );
      new BaseResult(result).toResponse(res);
    } catch (err) {
      new BaseResult(err).toResponse(res);
    }
  }
}
