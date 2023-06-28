import {
  Dispatch,
  Slice,
  SliceCaseReducers,
  bindActionCreators,
  configureStore,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { HistorySlice } from './history';
import { UserSlice } from './user';

const stores = configureStore({
  reducer: {
    history: HistorySlice.reducer,
    user: UserSlice.reducer,
  },
});

export default stores;

export type RootState = ReturnType<typeof stores.getState>;

export function useStores() {
  const dispatch = useDispatch();
  const store = useSelector((st: RootState) => st);

  const historyStore = createStore(HistorySlice, store.history, dispatch);
  const userStore = createStore(UserSlice, store.user, dispatch);

  return { historyStore, userStore };
}

function createStore<S, C extends SliceCaseReducers<S>, N extends string>(
  slice: Slice<S, C, N>,
  state: S,
  dispatch: Dispatch,
) {
  const sActions = bindActionCreators(
    slice.actions as any,
    dispatch,
  ) as typeof slice.actions;

  return { ...state, ...sActions };
}
