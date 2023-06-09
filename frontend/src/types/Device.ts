import { Model } from '.';

export interface Device {
  deviceId: string;
  currentModel: Model;
  deviceName: string;
  timestamp: Date;
}
