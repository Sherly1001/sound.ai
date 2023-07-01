import { BaseResult, Device, DeviceQuery, Pagination } from '../types';
import { axiosInstance } from './axios';

export namespace deviceService {
  export async function list(query: DeviceQuery) {
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
