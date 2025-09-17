import { EnrichedStopPlace } from '../../../../../types';

export type CutStopAreaValidityResult = {
  readonly mutatedStopArea: EnrichedStopPlace;
  readonly mutatedStopPoints: UUID[];
};
