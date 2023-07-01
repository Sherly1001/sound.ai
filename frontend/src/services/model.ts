import { BaseResult, Model, ModelQuery, ModelType, Pagination } from '../types';
import { storageGetItem } from '../utils/funcs';
import { axiosInstance } from './axios';

export namespace modelService {
  export async function list(query: ModelQuery) {
    return axiosInstance
      .get('/model/list', { params: query })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Pagination<Model>>);
  }

  export async function listType(query: ModelQuery) {
    return axiosInstance
      .get('/model/list-type', { params: query })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Pagination<ModelType>>);
  }

  export async function upload(modelName: string, typeId: string, file: File) {
    const formData = new FormData();
    formData.append('modelName', modelName);
    formData.append('typeId', typeId);
    formData.append('file', file);

    return axiosInstance
      .post('/model/upload', formData, {
        headers: {
          Authorization: 'Bearer ' + storageGetItem('token'),
        },
      })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<Model>);
  }

  export async function createType(typeName: string) {
    return axiosInstance
      .post('/model/create-type/' + typeName, null, {
        headers: {
          Authorization: 'Bearer ' + storageGetItem('token'),
        },
      })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<ModelType>);
  }

  export async function remove(modelId: string) {
    return axiosInstance
      .delete('/model/remove/' + modelId, {
        headers: {
          Authorization: 'Bearer ' + storageGetItem('token'),
        },
      })
      .catch((err) => {
        if (err.response) return err.response;
        throw err;
      })
      .then((res) => res.data as BaseResult<ModelType>);
  }
}
