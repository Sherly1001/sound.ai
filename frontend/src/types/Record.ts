import { Device } from '.';
import { Result } from './Result';

export interface Record {
  recordId: string;
  device: Device;
  timestamp: Date;
  temperature: number;
  humidity: number;
  audioFilePath: string;
  audioFft: string;
  imageFilePath: string;
  location: string;
  results?: Result[];
}
