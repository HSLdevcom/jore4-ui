import { StopRegistryStopPlaceInput } from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';

export type CreateStopVersionResult = {
  readonly stopPlaceId: string;
  readonly stopPlaceInput: StopRegistryStopPlaceInput;
  readonly stopPointId: UUID;
  readonly stopPointInput: ScheduledStopPointSetInput;
};
