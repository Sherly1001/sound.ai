import { Device } from '.';

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
}
