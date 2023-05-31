import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/admin.guard';
import { DeviceGuard } from 'src/auth/dev.guard';
import { AuthDevicePayload } from 'src/dtos/auth-device-payload.dto';
import { BaseResult, Pagination } from 'src/dtos/base-result.dto';
import { ListRecordParams, RecordUploadDto } from 'src/dtos/record.dto';
import { Record } from 'src/schema/entities';
import { StorageService } from 'src/storage/storage.service';
import { RecordService } from './record.service';

@ApiTags(RecordController.name)
@ApiExtraModels(BaseResult, Record)
@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly storageService: StorageService,
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
                    items: { $ref: getSchemaPath(Record) },
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
  async list(@Res() res: Response, @Query() params: ListRecordParams) {
    const [result, total] = await this.recordService.getRecords(params);
    new BaseResult(
      new Pagination(result, total, params.limit, params.page),
    ).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @Get('audio/:audioFilePath')
  async getAudio(
    @Res() res: Response,
    @Param('audioFilePath') audioFilePath: string,
  ) {
    try {
      const data = await this.storageService.getAudio(audioFilePath);
      res.attachment(audioFilePath);
      res.send(data);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @Get('images/:imageFilePath')
  async getImage(
    @Res() res: Response,
    @Param('imageFilePath') imageFilePath: string,
  ) {
    try {
      const data = await this.storageService.getImage(imageFilePath);
      res.attachment(imageFilePath);
      res.send(data);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(Record) },
          },
        },
      ],
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audioFile', maxCount: 1 },
      { name: 'imageFile', maxCount: 1 },
    ]),
  )
  @UseGuards(DeviceGuard)
  @ApiBearerAuth('devAuth')
  @Post('upload')
  async upload(
    @Req() req: Request,
    @Res() res: Response,
    @Body() record: RecordUploadDto,
    @UploadedFiles()
    files: {
      audioFile: Express.Multer.File[];
      imageFile: Express.Multer.File[];
    },
  ) {
    const dev: AuthDevicePayload = req['dev'];
    const result = await this.recordService.uploadRecord(
      dev.deviceId,
      files.audioFile[0],
      files.imageFile[0],
      record,
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(Record) },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove/:recordId')
  async delete(@Res() res: Response, @Param('recordId') recordId: string) {
    const result = await this.recordService.delete(recordId);
    new BaseResult(result).toResponse(res);
  }
}
