import { ApiProperty } from '@nestjs/swagger';
import { Record } from 'src/schema/entities';

export class StatisticDto {
  @ApiProperty()
  records: Record[];

  @ApiProperty()
  newRecords: number;

  @ApiProperty()
  numDevices: number;

  @ApiProperty()
  numModels: number;

  @ApiProperty()
  percentOk: number;
}
