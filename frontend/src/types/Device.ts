import { Model, OrderQuery, PageQuery, TimeQuery } from '.';

export interface Device {
  deviceId: string;
  currentModel?: Model;
  deviceName: string;
  timestamp: Date | string;
}

export interface DeviceQuery extends TimeQuery, PageQuery, OrderQuery {
  deviceName?: string;
  currentModel?: string;
}
