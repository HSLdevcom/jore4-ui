import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '../../types/UserInfo';

type IState = {
  readonly userInfo?: UserInfo;
};

const initialState: IState = {
  userInfo: undefined,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    loginFailed: (state) => {
      state.userInfo = undefined;
    },
  },
});

export const {
  loginSuccess: loginSuccessAction,
  loginFailed: loginFailedAction,
} = slice.actions;

export const userReducer = slice.reducer;
