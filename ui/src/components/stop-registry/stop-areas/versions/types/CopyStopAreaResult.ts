import { EnrichedStopPlace } from '../../../../../types';

export type CopyStopAreaResult = {
  readonly mutationResult: EnrichedStopPlace;
  readonly stopPointIds: ReadonlyArray<UUID>;
};
