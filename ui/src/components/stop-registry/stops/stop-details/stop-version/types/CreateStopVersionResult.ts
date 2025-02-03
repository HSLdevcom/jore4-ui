import { ScheduledStopPointSetInput } from '../../../../../../graphql';

export type CreateStopVersionResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly stopPointId: UUID;
  readonly stopPointInput: ScheduledStopPointSetInput;
};
