import { Dispatch, SetStateAction } from 'react';
import { EnrichedStopPlace } from '../../../../../types';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';

export type StopAreaComponentProps = {
  readonly area: EnrichedStopPlace;
  readonly className?: string;
};

export type EditableStopAreaComponentProps = {
  readonly area: EnrichedStopPlace;
  readonly className?: string;
  readonly blockInEdit: StopAreaEditableBlock | null;
  readonly onEditBlock: Dispatch<SetStateAction<StopAreaEditableBlock | null>>;
  readonly refetch: () => Promise<unknown>;
};
