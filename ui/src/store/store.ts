import { configureStore, Action, combineReducers } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import WorldSlice from './worldSlice';
import UserSlice from './userSlice';
import PreferencesSlice from './userPreferencesSlice';
import { ThunkAction } from 'redux-thunk';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const reducerr = combineReducers({
  world: WorldSlice,
  user: UserSlice,
  preferences: PreferencesSlice,
})

const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducerr)
const epicMiddleware = createEpicMiddleware();

const store:any = configureStore({
  reducer: persistedReducer,
  middleware: [epicMiddleware, thunk],
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [],
});

let persistor = persistStore(store);

export default store;
export { persistor };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
