import { EnrichedQuay, EnrichedStopPlace } from '../../../../types';
import { ResultSelection, StopSearchFilters } from '../types';

export type TriggerDownloadFn = (filename: string) => void;

export type QuayAndStopPlaceIds = {
  readonly quayNetexId: string;
  readonly stopPlaceNetexId: string;
};

export type ByAlreadyKnownIds = {
  readonly alreadyKnownIds: ReadonlyArray<QuayAndStopPlaceIds>;
};

export type ByFiltersAndSelection = {
  readonly filters: StopSearchFilters;
  readonly selection: ResultSelection;
};

export type EnrichedQuayWithTimingPlace = EnrichedQuay & {
  readonly timingPlace: string | null;
};

export type EnrichedStopDetails = {
  readonly stopPlace: EnrichedStopPlace;
  readonly quay: EnrichedQuayWithTimingPlace;
};

export interface TiamatStopDataFetcher {
  readonly allLoaded: Promise<boolean>;

  getEnrichedStopDetails(
    idPair: QuayAndStopPlaceIds,
  ): Promise<EnrichedStopDetails>;
}

export type InitTiamatStopDataFetcherFn = (
  allIds: ReadonlyArray<QuayAndStopPlaceIds>,
) => TiamatStopDataFetcher;
