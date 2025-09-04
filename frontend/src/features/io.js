import { createSlice } from '@reduxjs/toolkit';

const ioSlice = createSlice({
  name: 'io',
  initialState: {
    socket: null,
  },
  reducers: {
    setIO: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setIO } = ioSlice.actions;
export default ioSlice.reducer;
