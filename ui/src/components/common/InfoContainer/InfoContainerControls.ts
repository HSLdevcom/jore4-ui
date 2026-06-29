import { Dispatch, SetStateAction } from 'react';

export type InfoContainerControls = {
  readonly isExpandable: boolean;
  readonly isExpanded: boolean;
  readonly setIsExpanded: Dispatch<SetStateAction<boolean>>;

  readonly isEditable: boolean;
  readonly isInEditMode: boolean;
  readonly setIsInEditMode: Dispatch<SetStateAction<boolean>>;

  readonly onSave: () => void;
  readonly onCancel: () => void;
};
