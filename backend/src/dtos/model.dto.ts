import { ApiProperty, PickType } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class ModelUploadDto {
  @ApiProperty()
  modelName: string;

  @ApiProperty()
  typeId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class ListModelParams extends QueryParamsDto {
  @ApiProperty({ required: false })
  modelName: string;

  @ApiProperty({ required: false })
  modelType: string;
}

export class ListModelTypeParams extends PickType(QueryParamsDto, [
  'orderBy',
  'orderASC',
  'limit',
  'page',
]) {
  @ApiProperty({ required: false })
  modelType: string;
}
