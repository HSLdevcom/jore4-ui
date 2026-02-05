import { EnrichedQuay, EnrichedStopPlace } from '../../../../../types';

export type HistoricalStopData = {
  readonly stop_place: EnrichedStopPlace;
  readonly quay: EnrichedQuay;
};
