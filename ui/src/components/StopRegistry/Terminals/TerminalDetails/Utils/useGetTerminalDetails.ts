import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  ParentStopPlaceDetailsFragment,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetParentStopPlaceDetailsQuery,
} from '../../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../../hooks';
import {
  getParentStopPlacesFromQueryResult,
  useRequiredParams,
} from '../../../../../utils';
import {
  GetUserNameById,
  useGetUserNames,
} from '../../../../common/ChangeHistory';
import { useGetLatestStopPlaceChange } from '../../../StopAreas/Common';
import { getEnrichedParentStopPlace } from '../../Common';

const GQL_GET_PARENT_STOP_PLACE_DETAILS = gql`
  query GetParentStopPlaceDetails(
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      newestVersion: stops_database_stop_place_newest_version(where: $where) {
        id
        TiamatStopPlace {
          ...ParentStopPlaceDetails
        }
      }
    }
  }
`;

function useGetParentStopPlaceDetailsByWhere(
  where: StopsDatabaseStopPlaceNewestVersionBoolExp | null,
  getUserNameById: GetUserNameById,
  parentStopPlaceChangeData?: {
    changed: string | null;
    changedBy: string | null;
  },
) {
  const { data, ...rest } = useGetParentStopPlaceDetailsQuery(
    where ? { variables: { where } } : { skip: true },
  );

  const rawParentStopPlace =
    getParentStopPlacesFromQueryResult<ParentStopPlaceDetailsFragment>(
      data?.stopsDb?.newestVersion.at(0)?.TiamatStopPlace,
    ).at(0);
  const parentStopPlaceDetails = useMemo(
    () =>
      getEnrichedParentStopPlace(
        rawParentStopPlace,
        getUserNameById,
        parentStopPlaceChangeData,
      ),
    [rawParentStopPlace, getUserNameById, parentStopPlaceChangeData],
  );

  return { ...rest, parentStopPlaceDetails };
}

function useGetParentStopPlaceDetailsWhereConditions(): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const { privateCode = '' } = useRequiredParams<{ privateCode: string }>();

  return {
    private_code_value: { _eq: privateCode },
  };
}

function useGetParentStopPlaceDetailsWhereConditionsWithDate(): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const { privateCode = '' } = useRequiredParams<{ privateCode: string }>();
  const { observationDate } = useObservationDateQueryParam();
  const observationDateStr = observationDate.toISODate();

  return {
    _and: [
      { private_code_value: { _eq: privateCode } },
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

export function useGetParentStopPlaceDetails() {
  const getUserNameById = useGetUserNames();

  const { latestStopPlaceChangeData } = useGetLatestStopPlaceChange(
    useGetParentStopPlaceDetailsWhereConditions(),
  );

  const validResult = useGetParentStopPlaceDetailsByWhere(
    useGetParentStopPlaceDetailsWhereConditionsWithDate(),
    getUserNameById,
    latestStopPlaceChangeData,
  );

  const fallbackResult = useGetParentStopPlaceDetailsByWhere(
    useGetParentStopPlaceDetailsWhereConditions(),
    getUserNameById,
    latestStopPlaceChangeData,
  );

  const hasValidData = !!validResult.parentStopPlaceDetails;
  const hasFallbackData = !!fallbackResult.parentStopPlaceDetails;

  if (hasValidData) {
    return { ...validResult, isValidOnObservationDate: true };
  }

  if (hasFallbackData) {
    return { ...fallbackResult, isValidOnObservationDate: false };
  }

  return { ...validResult, isValidOnObservationDate: false };
}
