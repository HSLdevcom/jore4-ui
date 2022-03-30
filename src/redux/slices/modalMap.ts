import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  isOpen: boolean;
}

const initialState: IState = {
  isOpen: false,
};

const slice = createSlice({
  name: 'modalMap',
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen: setIsModalMapOpenAction } = slice.actions;

export const modalMapReducer = slice.reducer;
