import { ServicePatternScheduledStopPointInsertInput } from '../../../../../../generated/graphql';

export type CreateStopVersionResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly stopPointId: UUID;
  readonly stopPointInput: ServicePatternScheduledStopPointInsertInput;
};
