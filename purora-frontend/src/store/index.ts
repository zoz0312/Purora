import authReducer from './auth';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({
  authInfo: authReducer,
})

const rootStore = configureStore({ reducer: reducers });

export type AppDispatch = typeof rootStore.dispatch
export default rootStore;