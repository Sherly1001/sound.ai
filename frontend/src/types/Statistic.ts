import { Record } from '.';

export interface StatisticDto {
  records: Record[];
  newRecords: number;
  numDevices: number;
  numModels: number;
  percentOk: number;
}
