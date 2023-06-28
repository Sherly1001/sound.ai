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

  const history = useSelector((st: RootState) => st.history);
  const historyStore = createStore(HistorySlice, history, dispatch);

  const user = useSelector((st: RootState) => st.user);
  const userStore = createStore(UserSlice, user, dispatch);

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
