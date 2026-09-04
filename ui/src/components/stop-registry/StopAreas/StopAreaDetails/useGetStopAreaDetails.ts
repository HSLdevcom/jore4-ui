import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  StopPlaceDetailsFragment,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetStopPlaceDetailsQuery,
} from '../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../hooks';
import {
  getStopPlacesFromQueryResult,
  useRequiredParams,
} from '../../../../utils';
import {
  GetUserNameById,
  useGetUserNames,
} from '../../../common/ChangeHistory';
import { getEnrichedStopPlace, useGetLatestStopPlaceChange } from '../Common';

const GQL_GET_STOP_AREA_DETAILS = gql`
  query GetStopPlaceDetails(
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      newestVersion: stops_database_stop_place_newest_version(where: $where) {
        id
        TiamatStopPlace {
          ...StopPlaceDetails
        }
      }
    }
  }
`;

function useGetStopPlaceDetailsByWhere(
  where: StopsDatabaseStopPlaceNewestVersionBoolExp | null,
  getUserNameById?: GetUserNameById,
  stopPlaceChangeData?: {
    changed: string | null;
    changedBy: string | null;
  },
) {
  const { data, ...rest } = useGetStopPlaceDetailsQuery(
    where ? { variables: { where } } : { skip: true },
  );

  const rawStopPlace = getStopPlacesFromQueryResult<StopPlaceDetailsFragment>(
    data?.stopsDb?.newestVersion.at(0)?.TiamatStopPlace,
  ).at(0);
  const stopPlaceDetails = useMemo(
    () =>
      getEnrichedStopPlace(rawStopPlace, getUserNameById, stopPlaceChangeData),
    [rawStopPlace, getUserNameById, stopPlaceChangeData],
  );

  return { ...rest, stopPlaceDetails };
}

export function useGetStopPlaceDetailsById(id: string | null | undefined) {
  return useGetStopPlaceDetailsByWhere(id ? { netex_id: { _eq: id } } : null);
}

function useGetStopPlaceDetailsWhereConditions(): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const { id = '' } = useRequiredParams<{ id: string }>();

  if (id.startsWith('HSL')) {
    return { netex_id: { _eq: id } };
  }

  return {
    private_code_value: { _eq: id },
  };
}

function useGetStopPlaceDetailsWhereConditionsWithDate(): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const { id = '' } = useRequiredParams<{ id: string }>();
  const { observationDate } = useObservationDateQueryParam();
  const observationDateStr = observationDate.toISODate();

  if (id.startsWith('HSL')) {
    return {
      _and: [
        { netex_id: { _eq: id } },
        { validity_start: { _lte: observationDateStr } },
        {
          _or: [
            { validity_end: { _gte: observationDateStr } },
            { validity_end: { _is_null: true } },
          ],
        },
      ],
    };
  }

  return {
    _and: [
      { private_code_value: { _eq: id } },
      { validity_start: { _lte: observationDateStr } },
      {
        _or: [
          { validity_end: { _gte: observationDateStr } },
          { validity_end: { _is_null: true } },
        ],
      },
    ],
  };
}

export function useGetStopPlaceDetails() {
  const getUserNameById = useGetUserNames();

  const { latestStopPlaceChangeData } = useGetLatestStopPlaceChange(
    useGetStopPlaceDetailsWhereConditions(),
  );

  const validResult = useGetStopPlaceDetailsByWhere(
    useGetStopPlaceDetailsWhereConditionsWithDate(),
    getUserNameById,
    latestStopPlaceChangeData,
  );

  const fallbackResult = useGetStopPlaceDetailsByWhere(
    useGetStopPlaceDetailsWhereConditions(),
    getUserNameById,
    latestStopPlaceChangeData,
  );

  const hasValidData = !!validResult.stopPlaceDetails;
  const hasFallbackData = !!fallbackResult.stopPlaceDetails;

  if (hasValidData) {
    return { ...validResult, isValidOnObservationDate: true };
  }

  if (hasFallbackData) {
    return { ...fallbackResult, isValidOnObservationDate: false };
  }

  return { ...validResult, isValidOnObservationDate: false };
}
