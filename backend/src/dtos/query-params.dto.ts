import { ApiProperty } from '@nestjs/swagger';

export class QueryParamsDto {
  @ApiProperty({ required: false, type: 'string', format: 'date' })
  afterAt: Date;

  @ApiProperty({ required: false, type: 'string', format: 'date' })
  beforeAt: Date;

  @ApiProperty({ required: false })
  orderBy: string;

  @ApiProperty({ type: 'boolean', required: false, default: true })
  orderASC: string;

  @ApiProperty({ required: false, default: 20 })
  limit: number;

  @ApiProperty({ required: false, default: 1 })
  page: number;
}
