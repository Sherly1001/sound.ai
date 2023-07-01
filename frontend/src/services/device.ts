import { BaseResult, Device, DeviceQuery, Pagination } from '../types';
import { axiosInstance } from './axios';

export namespace deviceService {
  export async function list(query: DeviceQuery) {
    if (query.orderBy) {
      switch (query.orderBy) {
        case 'id':
          query.orderBy = 'Device.deviceId';
          break;
        case 'time':
          query.orderBy = 'Device.timestamp';
          break;
        case 'name':
          query.orderBy = 'Device.deviceName';
          break;
        case 'model':
          query.orderBy = 'Model.modelName';
          break;
        default:
          query.orderBy = 'Device.timestamp';
          query.orderASC = false;
      }
    }

    return axiosInstance
      .get('/device/list', { params: query })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Pagination<Device>>);
  }

  export async function create(deviceName: string, password: string) {
    return axiosInstance
      .post('/device/create', { deviceName, password })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Device>);
  }
}
