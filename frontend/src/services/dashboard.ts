import { BaseResult, StatisticDto } from '../types';
import { axiosInstance } from './axios';

export namespace dashboardService {
  export async function statistic() {
    return axiosInstance
      .get('/dashboard/statistic')
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<StatisticDto>);
  }
}
