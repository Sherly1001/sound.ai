import { BaseResult, Pagination, Record, RecordQuery } from '../types';
import { axiosInstance } from './axios';

export namespace recordService {
  export async function get(recordId: string) {
    return axiosInstance
      .get('/record/get/' + recordId)
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Record>);
  }

  export async function list(query: RecordQuery) {
    if (query.orderBy) {
      switch (query.orderBy) {
        case 'id':
          query.orderBy = 'Record.recordId';
          break;
        case 'time':
          query.orderBy = 'Record.timestamp';
          break;
        case 'device':
          query.orderBy = 'Device.deviceName';
          break;
        case 'temperature':
          query.orderBy = 'Record.temperature';
          break;
        case 'humidity':
          query.orderBy = 'Record.humidity';
          break;
        default:
          query.orderBy = 'Record.timestamp';
          query.orderASC = false;
      }
    }

    return axiosInstance
      .get('/record/list', { params: query })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Pagination<Record>>);
  }
}
