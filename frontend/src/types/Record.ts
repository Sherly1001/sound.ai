import { Device, OrderQuery, PageQuery, TimeQuery } from '.';
import { Result } from './Result';

export interface Record {
  recordId: string;
  device: Device;
  timestamp: Date;
  temperature: number;
  humidity: number;
  audioFilePath: string;
  audioFft?: string;
  imageFilePath: string;
  location: string;
  results?: Result[];
}

export interface RecordQuery extends TimeQuery, PageQuery, OrderQuery {
  deviceName?: string;
  temperature?: string;
  humidity?: string;
}
