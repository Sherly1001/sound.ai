import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BaseResult } from 'src/dtos/base-result.dto';
import { StatisticDto } from 'src/dtos/statistic.dto';
import { Record } from 'src/schema/entities';
import { DashboardService } from './dashboard.service';

@ApiTags(DashboardController.name)
@ApiExtraModels(BaseResult, StatisticDto)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              allOf: [
                {
                  $ref: getSchemaPath(StatisticDto),
                },
                {
                  properties: {
                    newRecords: { $ref: getSchemaPath(Record) },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @Get('statistic')
  async statistic(@Res() res: Response) {
    const result = await this.dashboardService.getSatistic();
    new BaseResult(result).toResponse(res);
  }
}
