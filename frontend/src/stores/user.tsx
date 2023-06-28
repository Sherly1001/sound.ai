import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../types';
import {
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '../utils/funcs';

export interface UserState {
  user?: User;
  token?: string;
}

const initialState: UserState = {
  user: storageGetItem<User>('user'),
  token: storageGetItem('token'),
};

export const UserSlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    logout: (st) => {
      st.user = undefined;
      st.token = undefined;
      storageRemoveItem('user');
      storageRemoveItem('token');
    },

    setUser: (st, ac: PayloadAction<User>) => {
      st.user = ac.payload;
      storageSetItem('user', ac.payload);
    },

    setToken: (st, ac: PayloadAction<string>) => {
      st.token = ac.payload;
      storageSetItem('token', ac.payload);
    },
  },
});
