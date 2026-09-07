import { EnrichedStopPlace } from '../../../../../types';

export type CutStopAreaValidityResult = {
  readonly mutatedStopArea: EnrichedStopPlace;
  readonly mutatedStopPoints: UUID[];
};

export type CutDirection = 'start' | 'end'; // 'start' = cut from beginning, 'end' = cut from end
