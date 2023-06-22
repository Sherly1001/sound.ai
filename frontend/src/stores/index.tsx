import { bindActionCreators, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { HistorySlice } from './history';

const stores = configureStore({
  reducer: {
    history: HistorySlice.reducer,
  },
});

export default stores;
export type RootState = ReturnType<typeof stores.getState>;
export function useStores() {
  const dispatch = useDispatch();
  const store = useSelector((st: RootState) => st);

  const historyActions = bindActionCreators(HistorySlice.actions, dispatch);
  const historyStore = { ...store.history, ...historyActions };

  return { historyStore };
}
