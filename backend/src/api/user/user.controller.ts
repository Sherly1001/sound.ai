import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
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
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserGuard } from 'src/auth/user.guard';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';
import { BaseResult, Pagination } from 'src/dtos/base-result.dto';
import { ListUserParams, UserDto, UserUpdateDto } from 'src/dtos/user.dto';
import { User } from 'src/schema/entities';
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
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              allOf: [
                { $ref: getSchemaPath(Pagination) },
                {
                  properties: {
                    items: { $ref: getSchemaPath(User) },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Get('list')
  async list(@Res() res: Response, @Query() params: ListUserParams) {
    const [result, total] = await this.userService.getUsers(params);
    new BaseResult(
      new Pagination(result, total, params.limit, params.page),
    ).toResponse(res);
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
  @Get('get')
  async getInfo(@Req() req: Request, @Res() res: Response) {
    const user: AuthUserPayload = req['user'];
    const result = await this.userService.getUser(user.userId);
    new BaseResult(result).toResponse(res);
  }

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
    const result = await this.userService.createUser(
      body.username,
      body.password,
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'string' },
          },
        },
      ],
    },
  })
  @Post('login')
  async login(@Res() res: Response, @Body() body: UserDto) {
    const token = await this.authService.userLogin(
      body.username,
      body.password,
    );
    new BaseResult(token).toResponse(res);
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
    const user: AuthUserPayload = req['user'];
    const result = await this.userService.updateUser(
      user.userId,
      UserDto.toHashPassword(body),
    );
    new BaseResult(result).toResponse(res);
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
  @Delete('remove')
  async delete(@Req() req: Request, @Res() res: Response) {
    const user: AuthUserPayload = req['user'];
    const result = await this.userService.deleteUser(user.userId);
    new BaseResult(result).toResponse(res);
  }
}
