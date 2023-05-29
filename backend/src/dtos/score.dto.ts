import { ApiProperty } from '@nestjs/swagger';

export class UploadScoreDto {
  @ApiProperty()
  labelId: string;

  @ApiProperty()
  score: number;
}
