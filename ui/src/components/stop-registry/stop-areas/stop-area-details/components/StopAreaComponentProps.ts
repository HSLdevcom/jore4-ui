import { Dispatch, SetStateAction } from 'react';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';

export type StopAreaComponentProps = {
  readonly area: StopAreaDetailsFragment;
  readonly className?: string;
};

export type EditableStopAreaComponentProps = {
  readonly area: StopAreaDetailsFragment;
  readonly className?: string;
  readonly blockInEdit: StopAreaEditableBlock | null;
  readonly onEditBlock: Dispatch<SetStateAction<StopAreaEditableBlock | null>>;
  readonly refetch: () => Promise<unknown>;
};
