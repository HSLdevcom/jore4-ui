import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  StopPlaceDetailsFragment,
  StopRegistryStopPlaceInterface,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetStopPlaceDetailsQuery,
} from '../../../../generated/graphql';
import {
  useGetUserNames,
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../../hooks';
import { EnrichedStopPlace } from '../../../../types';
import {
  getStopPlaceDetailsForEnrichment,
  getStopPlacesFromQueryResult,
} from '../../../../utils';
import { useGetLatestStopPlaceChange } from './hooks/useGetStopPlaceChangeHistory';

const GQL_GET_STOP_AREA_DETAILS = gql`
  query getStopPlaceDetails(
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      newestVersion: stops_database_stop_place_newest_version(where: $where) {
        id
        TiamatStopPlace {
          ...stop_place_details
        }
      }
    }
  }

  fragment stop_place_details on stop_registry_StopPlace {
    id
    version

    alternativeNames {
      name {
        lang
        value
      }
      nameType
    }

    privateCode {
      value
      type
    }

    name {
      lang
      value
    }

    organisations {
      relationshipType
      organisationRef
      organisation {
        ...stop_place_organisation_fields
      }
    }

    geometry {
      type
      coordinates
    }

    keyValues {
      key
      values
    }

    quays {
      ...quay_details
    }

    parentStopPlace {
      ...terminal_details
    }

    accessibilityAssessment {
      ...accessibility_assessment_details
    }

    transportMode
    topographicPlace {
      ...topographic_place_details
    }
    fareZones {
      ...fare_zone_details
    }

    # Make sure we have all the details needed to display the member rows.
    ...StopTableRow_StopArea_Details
  }

  fragment terminal_details on stop_registry_ParentStopPlace {
    id
    version

    name {
      lang
      value
    }
    privateCode {
      value
      type
    }
    children {
      ...member_stop_stop_place_details
    }
  }
`;

export function getEnrichedStopPlace(
  stopPlace: StopPlaceDetailsFragment | null | undefined,
  getUserNameById?: (userId: string | null | undefined) => string | null,
  stopPlaceChangeData?: {
    changed: string | null;
    changedBy: string | null;
  },
): EnrichedStopPlace | null {
  if (!stopPlace) {
    return null;
  }

  const changeData = stopPlaceChangeData;
  const changedByUserName = getUserNameById?.(changeData?.changedBy);

  const transformedStopPlace = {
    ...stopPlace,
    parentStopPlace: stopPlace.parentStopPlace
      ? [stopPlace.parentStopPlace as StopRegistryStopPlaceInterface]
      : undefined,
  };

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(transformedStopPlace),
    changed: changeData?.changed,
    changedByUserName,
  };
}

function useGetStopPlaceDetailsByWhere(
  where: StopsDatabaseStopPlaceNewestVersionBoolExp | null,
  getUserNameById?: (userId: string | null | undefined) => string | null,
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
  const { getUserNameById } = useGetUserNames();

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
