import { GetStopPointsByQuayIdQuery } from '../../../../../generated/graphql';

export type MoveQuayParams = {
  toStopPlaceId: string;
  quayIds: string[];
  moveQuayFromDate: string;
  fromVersionComment: string;
  toVersionComment: string;
};

export type QuayInfo = {
  id: string;
  publicCode: string;
};

export type StopPointInfo =
  GetStopPointsByQuayIdQuery['service_pattern_scheduled_stop_point'][0];

export type MoveStopPlace = {
  __typename?: string;
  id?: string | null;
  version?: string | null;
  versionComment?: string | null;
  quays?: Array<{
    __typename?: string;
    id?: string | null;
    publicCode?: string | null;
    keyValues?: Array<{
      __typename?: string;
      key?: string | null;
      values?: Array<string | null> | null;
    } | null> | null;
  } | null> | null;
};
