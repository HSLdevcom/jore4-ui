import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  ParentStopPlaceDetailsFragment,
  StopRegistryParentStopPlace,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetParentStopPlaceDetailsQuery,
} from '../../../../generated/graphql';
import {
  GetUserNameById,
  useGetUserNames,
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../../hooks';
import { EnrichedParentStopPlace } from '../../../../types';
import {
  getParentStopPlaceDetailsForEnrichment,
  getParentStopPlacesFromQueryResult,
} from '../../../../utils';
import { useGetLatestStopPlaceChange } from '../../stop-areas/stop-area-details/hooks/useGetStopPlaceChangeHistory';

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

  fragment ParentStopPlaceDetails on stop_registry_ParentStopPlace {
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

    description {
      lang
      value
    }

    geometry {
      type
      coordinates
    }

    topographicPlace {
      id
      version

      name {
        value
      }
    }

    fareZones {
      id
      version

      name {
        value
      }
    }

    keyValues {
      key
      values
    }

    infoSpots {
      ...InfoSpotDetails
    }

    accessibilityAssessment {
      ...AccessibilityAssessmentDetails
    }

    children {
      ...MemberStopStopPlaceDetails
    }

    externalLinks {
      ...TerminalExternalLinksDetails
    }

    organisations {
      ...TerminalOrganizationRef
    }
  }

  fragment MemberStopStopPlaceDetails on stop_registry_StopPlace {
    id
    version

    name {
      value
    }
    privateCode {
      value
    }
    quays {
      ...MemberStopQuayDetails
    }

    # Make sure we have all the details needed to display the member rows.
    ...StopTableRowStopAreaDetails
  }

  fragment MemberStopQuayDetails on stop_registry_Quay {
    id
    version

    publicCode
    description {
      lang
      value
    }
    scheduled_stop_point {
      ...ScheduledStopPointDetailFields
    }
    keyValues {
      key
      values
    }
    infoSpots {
      ...InfoSpotDetails
    }
    geometry {
      type
      coordinates
    }
    placeEquipments {
      id
      generalSign {
        id
        version

        content {
          value
        }
      }
      shelterEquipment {
        id
        version

        shelterNumber
      }
    }
  }

  fragment TerminalExternalLinksDetails on stop_registry_stopPlaceExternalLink {
    stopPlaceId
    orderNum
    name
    location
  }

  fragment TerminalOrganizationRef on stop_registry_StopPlaceOrganisationRef {
    organisationRef
    relationshipType
    organisation {
      ...StopPlaceOrganisationFields
    }
  }
`;

export function getEnrichedParentStopPlace(
  parentStopPlace: ParentStopPlaceDetailsFragment | null | undefined,
  getUserNameById?: GetUserNameById,
  parentStopPlaceChangeData?: {
    changed: string | null;
    changedBy: string | null;
  },
): EnrichedParentStopPlace | null {
  if (!parentStopPlace) {
    return null;
  }

  const changeData = parentStopPlaceChangeData;
  const changedByUserName = getUserNameById?.(changeData?.changedBy);

  return {
    ...parentStopPlace,
    ...getParentStopPlaceDetailsForEnrichment(
      parentStopPlace as StopRegistryParentStopPlace,
    ),
    changed: changeData?.changed,
    changedByUserName,
  } as EnrichedParentStopPlace;
}

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
  const { getUserNameById } = useGetUserNames();

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
