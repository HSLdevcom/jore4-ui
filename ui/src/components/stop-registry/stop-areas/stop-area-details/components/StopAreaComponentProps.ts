import { Dispatch, SetStateAction } from 'react';
import { StopPlaceWithDetails } from '../../../../../hooks';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';

export type StopAreaComponentProps = {
  readonly area: StopPlaceWithDetails;
  readonly className?: string;
};

export type EditableStopAreaComponentProps = {
  readonly area: StopPlaceWithDetails;
  readonly className?: string;
  readonly blockInEdit: StopAreaEditableBlock | null;
  readonly onEditBlock: Dispatch<SetStateAction<StopAreaEditableBlock | null>>;
  readonly refetch: () => Promise<unknown>;
};
