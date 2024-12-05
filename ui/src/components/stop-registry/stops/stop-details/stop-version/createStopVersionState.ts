import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

export type CreateStopVersionModalState = {
  modalOpen: boolean;
};

const defaultCloneStopState: CreateStopVersionModalState = {
  modalOpen: false,
};

const initialState: CreateStopVersionModalState = Object.values(
  defaultCloneStopState,
).reduce(
  (state: CreateStopVersionModalState) => ({
    ...state,
    ...defaultCloneStopState,
  }),
  {} as CreateStopVersionModalState,
);

const createStopVersionSlice = createSlice({
  name: 'createStopVersion',
  initialState,
  reducers: {
    setValues: (
      state: CreateStopVersionModalState,
      action: PayloadAction<Partial<CreateStopVersionModalState>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setValues } = createStopVersionSlice.actions;

export const createStopVersionState = createStopVersionSlice.reducer;

export const createStopVersionStopStore = configureStore({
  reducer: {
    reducer: createStopVersionState, // Add the slice reducer to the store
  },
});

export type CreateStopVersionStopModalState = ReturnType<
  typeof createStopVersionStopStore.getState
>;
