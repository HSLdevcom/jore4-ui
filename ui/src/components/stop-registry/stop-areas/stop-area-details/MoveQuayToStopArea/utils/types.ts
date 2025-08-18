import { GetStopPointsByQuayIdQuery } from '../../../../../../generated/graphql';

export type MoveQuayParams = {
  toStopPlaceId: string;
  quayIds: ReadonlyArray<string>;
  moveQuayFromDate: string;
  fromVersionComment: string;
  toVersionComment: string;
};

export type QuayInfo = {
  id: string;
  publicCode: string;
  validityStart?: string;
};

export type StopPointInfo =
  GetStopPointsByQuayIdQuery['service_pattern_scheduled_stop_point'][0];

export type MoveStopPlace = {
  __typename?: string;
  id?: string | null;
  version?: string | null;
  versionComment?: string | null;
  quays?: ReadonlyArray<{
    __typename?: string;
    id?: string | null;
    publicCode?: string | null;
    keyValues?: ReadonlyArray<{
      __typename?: string;
      key?: string | null;
      values?: ReadonlyArray<string | null> | null;
    } | null> | null;
  } | null> | null;
};
