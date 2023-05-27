import { ApiProperty } from '@nestjs/swagger';

export class ModelUploadDto {
  @ApiProperty()
  modelName: string;

  @ApiProperty()
  typeId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
