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
    return axiosInstance
      .get('/record/list', { params: query })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Pagination<Record>>);
  }
}
