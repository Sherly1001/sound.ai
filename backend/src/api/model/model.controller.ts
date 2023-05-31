import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { BaseResult, Pagination } from 'src/dtos/base-result.dto';
import {
  ListModelParams,
  ListModelTypeParams,
  ModelUploadDto,
} from 'src/dtos/model.dto';
import { Model, ModelType } from 'src/schema/entities';
import { ModelService } from './model.service';

@ApiTags(ModelController.name)
@ApiExtraModels(BaseResult, Pagination, Model)
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

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
                    items: { $ref: getSchemaPath(Model) },
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
  async list(@Res() res: Response, @Query() params: ListModelParams) {
    const [result, total] = await this.modelService.getModels(params);
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
            data: {
              allOf: [
                { $ref: getSchemaPath(Pagination) },
                {
                  properties: {
                    items: { $ref: getSchemaPath(ModelType) },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @Get('list-type')
  async listType(@Res() res: Response, @Query() params: ListModelTypeParams) {
    const [result, total] = await this.modelService.getModelTypes(params);
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
            data: { type: 'array', items: { $ref: getSchemaPath(ModelType) } },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Post('create-type/:typeName')
  async createType(@Res() res: Response, @Param('typeName') typeName: string) {
    const result = await this.modelService.createModelType(typeName);
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
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove-type/:typeId')
  async removeType(@Res() res: Response, @Param('typeId') typeId: string) {
    const result = await this.modelService.removeModelType(typeId);
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
      file,
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
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove/:modelId')
  async delete(@Res() res: Response, @Param('modelId') modelId: string) {
    const result = await this.modelService.removeModel(modelId);
    new BaseResult(result).toResponse(res);
  }
}
