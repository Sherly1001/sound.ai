import { BaseResult, User } from '../types';
import { storageGetItem } from '../utils/funcs';
import { axiosInstance } from './axios';

export namespace userService {
  export async function login(username: string, password: string) {
    return axiosInstance
      .post('user/login', { username, password })
      .catch((err) => err.response)
      .then((res) => res.data as BaseResult<string>);
  }

  export async function register(username: string, password: string) {
    return axiosInstance
      .post('user/create', { username, password })
      .catch((err) => err.response)
      .then((res) => res.data as BaseResult<User>);
  }

  export async function getInfo() {
    return axiosInstance
      .get('user/get', {
        headers: {
          Authorization: 'Bearer ' + storageGetItem('token'),
        },
      })
      .catch((err) => err.response)
      .then((res) => res.data as BaseResult<User>);
  }

  export async function update(
    currentPassword: string,
    username?: string,
    password?: string,
  ) {
    return axiosInstance
      .put(
        'user/update',
        { currentPassword, username, password },
        {
          headers: {
            Authorization: 'Bearer ' + storageGetItem('token'),
          },
        },
      )
      .catch((err) => err.response)
      .then((res) => res.data as BaseResult<User>);
  }

  export async function remove() {
    return axiosInstance
      .delete('user/remove', {
        headers: {
          Authorization: 'Bearer ' + storageGetItem('token'),
        },
      })
      .catch((err) => err.response)
      .then((res) => res.data as BaseResult<User>);
  }
}
