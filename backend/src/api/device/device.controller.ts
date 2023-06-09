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
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { DeviceGuard } from 'src/auth/dev.guard';
import { AuthDevicePayload } from 'src/dtos/auth-device-payload.dto';
import { BaseResult, Pagination } from 'src/dtos/base-result.dto';
import {
  DeviceDto,
  DeviceUpdateDto,
  ListDeviceParams,
} from 'src/dtos/device.dto';
import { Device } from 'src/schema/entities';
import { DeviceService } from './device.service';

@ApiTags(DeviceController.name)
@ApiExtraModels(BaseResult, Pagination, Device)
@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
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
                    items: { $ref: getSchemaPath(Device) },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @Get('list')
  async list(@Res() res: Response, @Query() params: ListDeviceParams) {
    const [result, total] = await this.deviceService.getDevices(params);
    new BaseResult(
      new Pagination(result, total, params.limit, params.page),
    ).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
      properties: {
        data: { $ref: getSchemaPath(Device) },
      },
    },
  })
  @Post('create')
  async create(@Res() res: Response, @Body() body: DeviceDto) {
    const result = await this.deviceService.create(
      body.deviceName,
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
  async login(@Res() res: Response, @Body() body: DeviceDto) {
    const token = await this.authService.devLogin(
      body.deviceName,
      body.password,
    );
    new BaseResult(token).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
      properties: {
        data: { $ref: getSchemaPath(Device) },
      },
    },
  })
  @UseGuards(DeviceGuard)
  @ApiBearerAuth('devAuth')
  @Put('update')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: DeviceUpdateDto,
  ) {
    const dev: AuthDevicePayload = req['dev'];
    const result = await this.deviceService.updateDev(
      dev.deviceId,
      DeviceDto.toHashPassword(body),
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(BaseResult),
      properties: {
        data: { $ref: getSchemaPath(Device) },
      },
    },
  })
  @UseGuards(DeviceGuard)
  @ApiBearerAuth('devAuth')
  @Delete('remove')
  async delete(@Req() req: Request, @Res() res: Response) {
    const dev: AuthDevicePayload = req['dev'];
    const result = await this.deviceService.deleteDev(dev.deviceId);
    new BaseResult(result).toResponse(res);
  }
}
