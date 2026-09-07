export type StopPlaceVersionSpecifier = {
  readonly stopPlaceNetexId: string;
  readonly stopPlaceVersion: string;
};

export type QuayVersionSpecifier = {
  readonly netexId: string;
  readonly version: string;
};

export type HistoricalStopVersionSpecifier = QuayVersionSpecifier &
  StopPlaceVersionSpecifier;
