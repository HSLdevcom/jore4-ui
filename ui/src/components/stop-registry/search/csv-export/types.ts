import { DateLike } from '../../../../time';
import { EnrichedQuay, EnrichedStopPlace } from '../../../../types';
import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';
import { ResultSelection, StopSearchFilters } from '../types';

export type TriggerDownloadFn = (filename: string) => void;

export type QuayAndStopPlaceIds = {
  readonly quayNetexId: string;
  readonly stopPlaceNetexId: string;
};

export type ByAlreadyKnownIds = {
  readonly abortSignal: AbortSignal;
  readonly alreadyKnownIds: ReadonlyArray<QuayAndStopPlaceIds>;
};

export type ByFiltersAndSelection = {
  readonly abortSignal: AbortSignal;
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

export type OnQuaysProcessedProgress = (quaysProcessed: number) => void;

export type InitTiamatStopDataFetcherFn = (
  allIds: ReadonlyArray<QuayAndStopPlaceIds>,
  abortSignal: AbortSignal,
  onProgress: OnQuaysProcessedProgress,
) => TiamatStopDataFetcher;

export type OnProgress = (
  progress:
    | { readonly indeterminate: true; readonly progress?: never }
    | { readonly indeterminate: false; readonly progress: number },
) => void;

export interface ReportSection {
  fieldCount: number;
  shouldHavePadding: boolean;
  writeMetaHeaders(writer: CSVWriter): void;
  writeHeader(writer: CSVWriter): void;
  writeRecordFields(writer: CSVWriter, record: EnrichedStopDetails): void;
}

export type ReportContext = {
  readonly observationDate: DateLike;
};

export type ReportSectionInstantiator = {
  readonly forDataset: (
    data: ReadonlyArray<EnrichedStopDetails>,
    context: ReportContext,
  ) => ReportSection;
};
