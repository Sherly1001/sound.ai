import { OrGuard } from '@nest-lab/or-guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AdminGuard } from 'src/auth/admin.guard';
import { DeviceGuard } from 'src/auth/dev.guard';
import { UserGuard } from 'src/auth/user.guard';
import { AuthDevicePayload } from 'src/dtos/auth-device-payload.dto';
import { AuthUserPayload } from 'src/dtos/auth-user-payload.dto';
import { BaseResult, Pagination } from 'src/dtos/base-result.dto';
import {
  ListLabelParams,
  ListResultParams,
  UploadScoreDto,
} from 'src/dtos/score.dto';
import { DiagnosticResult, Label, Score } from 'src/schema/entities';
import { ResultService } from './result.service';

@ApiTags(ResultController.name)
@ApiExtraModels(BaseResult, DiagnosticResult, Score, UploadScoreDto)
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

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
                    items: { $ref: getSchemaPath(DiagnosticResult) },
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
  async list(@Res() res: Response, @Query() params: ListResultParams) {
    const [result, total] = await this.resultService.getResults(params);
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
                    items: { $ref: getSchemaPath(Label) },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @Get('list-label')
  async listLabels(@Res() res: Response, @Query() params: ListLabelParams) {
    const [result, total] = await this.resultService.getLabels(params);
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
            data: { type: 'array', items: { $ref: getSchemaPath(Label) } },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Post('create-label/:labelName')
  async createLabel(
    @Res() res: Response,
    @Param('labelName') labelName: string,
  ) {
    const result = await this.resultService.createLabel(labelName);
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'array', items: { $ref: getSchemaPath(Label) } },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove-label/:labelId')
  async removeLabel(@Res() res: Response, @Param('labelId') labelId: string) {
    const result = await this.resultService.removeLabel(labelId);
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(DiagnosticResult) },
          },
        },
      ],
    },
  })
  @UseGuards(OrGuard([UserGuard, DeviceGuard]))
  @ApiBearerAuth('userAuth')
  @ApiBearerAuth('devAuth')
  @Post('diagnostic/:recordId/:modelId')
  async diagnostic(
    @Req() req: Request,
    @Res() res: Response,
    @Param('recordId') recordId: string,
    @Param('modelId') modelId: string,
  ) {
    const user: AuthUserPayload = req['user'];
    const dev: AuthDevicePayload = req['dev'];
    const result = await this.resultService.diagnostic(
      recordId,
      modelId,
      user?.userId ?? null,
      dev?.deviceId ?? null,
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(DiagnosticResult) },
          },
        },
      ],
    },
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(UploadScoreDto) },
    },
  })
  @UseGuards(OrGuard([UserGuard, DeviceGuard]))
  @ApiBearerAuth('userAuth')
  @ApiBearerAuth('devAuth')
  @Post('upload-scores/:recordId/:modelId')
  async uploadScores(
    @Req() req: Request,
    @Res() res: Response,
    @Param('recordId') recordId: string,
    @Param('modelId') modelId: string,
    @Body() scores: UploadScoreDto[],
  ) {
    const user: AuthUserPayload = req['user'];
    const dev: AuthDevicePayload = req['dev'];
    const result = await this.resultService.uploadScores(
      recordId,
      modelId,
      scores,
      user?.userId ?? null,
      dev?.deviceId ?? null,
    );
    new BaseResult(result).toResponse(res);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(DiagnosticResult) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth('adminAuth')
  @Delete('remove/:resultId')
  async removeResult(
    @Res() res: Response,
    @Param('resultId') resultId: string,
  ) {
    const result = await this.resultService.removeResult(resultId);
    new BaseResult(result).toResponse(res);
  }
}
