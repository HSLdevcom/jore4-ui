import { mapReducer } from './slices/map';
import { modalMapReducer } from './slices/modalMap';

export const rootReducer = {
  map: mapReducer,
  modalMap: modalMapReducer,
};
