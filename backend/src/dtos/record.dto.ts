import { ApiProperty, PickType } from '@nestjs/swagger';
import { Record } from 'src/schema/entities/record.entity';

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
