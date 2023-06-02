import { ApiProperty, PickType } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class UploadScoreDto {
  @ApiProperty()
  labelId: string;

  @ApiProperty()
  score: number;
}

export class ListResultParams extends QueryParamsDto {
  @ApiProperty({ required: false })
  deviceName: string;

  @ApiProperty({ required: false })
  modelName: string;

  @ApiProperty({ required: false })
  modelType: string;

  @ApiProperty({ required: false })
  score: string;

  @ApiProperty({ required: false })
  labelName: string;

  @ApiProperty({ required: false })
  diagnosticByUser: string;

  @ApiProperty({ required: false })
  diagnosticByDevice: string;
}

export class ListLabelParams extends PickType(QueryParamsDto, [
  'orderASC',
  'limit',
  'page',
]) {
  @ApiProperty({ required: false })
  labelName: string;
}
