import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { UserGuard } from 'src/auth/user.guard';
import { BaseResult } from 'src/dtos/base-result.dto';
import { ModelUploadDto } from 'src/dtos/model.dto';
import { ModelType } from 'src/schema/entities/model-type.entity';
import { Model } from 'src/schema/entities/model.entity';
import { ModelService } from './model.service';

@ApiTags(ModelController.name)
@ApiExtraModels(BaseResult, Model)
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'array', items: { $ref: getSchemaPath(Model) } },
          },
        },
      ],
    },
  })
  @Get('list')
  async list(@Res() res: Response) {
    const result = await this.modelService.getModels();
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'array', items: { $ref: getSchemaPath(ModelType) } },
          },
        },
      ],
    },
  })
  @Get('list-type')
  async listType(@Res() res: Response) {
    const result = await this.modelService.getModelTypes();
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @Get('download/:modelId')
  async download(@Res() res: Response, @Param('modelId') modelId: string) {
    const result = await this.modelService.downloadModel(modelId);
    res.attachment(modelId);
    res.send(result);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(Model) },
          },
        },
      ],
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(
    @Res() res: Response,
    @Body() model: ModelUploadDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const result = await this.modelService.uploadModel(
      model.modelName,
      model.typeId,
      file.buffer,
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(Model) },
          },
        },
      ],
    },
  })
  @UseGuards(UserGuard, AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove/:modelId')
  async delete(@Res() res: Response, @Param('modelId') modelId: string) {
    const result = await this.modelService.removeModel(modelId);
    new BaseResult(result).toResponse(res);
  }
}
