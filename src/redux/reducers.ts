import { reducer as user, types as userTypes } from './user';

export interface IAppState {
  user: userTypes.IUser;
}

export const reducers = {
  user
};
