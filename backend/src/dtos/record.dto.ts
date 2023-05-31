import { ApiProperty, PickType } from '@nestjs/swagger';
import { Record } from 'src/schema/entities/record.entity';
import { QueryParamsDto } from './query-params.dto';

export class RecordUploadDto extends PickType(Record, [
  'temperature',
  'humidity',
  'location',
  'audioFft',
]) {
  @ApiProperty({ type: 'string', format: 'binary' })
  audioFile: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: Express.Multer.File;
}

export class ListRecordParams extends QueryParamsDto {
  @ApiProperty({ required: false })
  deviceName: string;

  @ApiProperty({ required: false })
  temperature: string;

  @ApiProperty({ required: false })
  humidity: string;
}
