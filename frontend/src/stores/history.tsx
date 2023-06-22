import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface HistoryState {
  history: string[];
}

const initialState: HistoryState = {
  history: [],
};

export const HistorySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    push(st, ac: PayloadAction<string>) {
      const last = st.history[st.history.length - 1];
      const prev = st.history[st.history.length - 2];

      if (prev && prev == ac.payload) {
        st.history.pop();
      } else if (last != ac.payload) {
        st.history.push(ac.payload);
      }
    },
  },
});
