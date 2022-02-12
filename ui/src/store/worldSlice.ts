import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setWorld(state:any, { payload }: PayloadAction<string[]>) {
      state = payload;
      return state;
    },
    resetWorld(state: any) {
      state = [];
      return state;
    },
  },
});

export const { setWorld, resetWorld } = worldSlice.actions;
export default worldSlice.reducer;
