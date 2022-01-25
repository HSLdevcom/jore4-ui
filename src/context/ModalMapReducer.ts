import produce from 'immer';

export interface IModalMapContext {
  isOpen: boolean;
}

export const initialState: IModalMapContext = {
  isOpen: false,
};

export type ModalMapActions = 'open' | 'close';

const reducerFunction = (
  draft: IModalMapContext,
  action: {
    type: ModalMapActions;
    payload?: Partial<IModalMapContext>;
  },
) => {
  const { type } = action;

  // note: with the use or 'immer', we can modify the state object directly
  switch (type) {
    case 'open':
      draft.isOpen = true;
      break;
    case 'close':
      draft.isOpen = false;
      break;
    default:
  }
  return draft;
};

export const modalMapReducer = produce(reducerFunction);
