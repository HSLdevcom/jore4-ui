import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  ParentStopPlaceDetailsFragment,
  StopRegistryParentStopPlace,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetParentStopPlaceDetailsQuery,
} from '../../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../../hooks';
import { EnrichedParentStopPlace } from '../../../../types';
import {
  getParentStopPlaceDetailsForEnrichment,
  getParentStopPlacesFromQueryResult,
} from '../../../../utils';

const GQL_GET_PARENT_STOP_PLACE_DETAILS = gql`
  query getParentStopPlaceDetails(
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      newestVersion: stops_database_stop_place_newest_version(where: $where) {
        id
        TiamatStopPlace {
          ...parent_stop_place_details
        }
      }
    }
  }

  fragment parent_stop_place_details on stop_registry_ParentStopPlace {
    id

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
      name {
        value
      }
    }

    fareZones {
      name {
        value
      }
    }

    keyValues {
      key
      values
    }

    infoSpots {
      ...info_spot_details
    }

    accessibilityAssessment {
      ...accessibility_assessment_details
    }

    children {
      ...member_stop_stop_place_details
    }

    externalLinks {
      ...terminal_external_links_details
    }

    organisations {
      ...terminal_organization_ref
    }
  }

  fragment member_stop_stop_place_details on stop_registry_StopPlace {
    id
    name {
      value
    }
    privateCode {
      value
    }
    quays {
      ...member_stop_quay_details
    }

    # Make sure we have all the details needed to display the member rows.
    ...StopTableRow_StopArea_Details
  }

  fragment member_stop_quay_details on stop_registry_Quay {
    id
    publicCode
    description {
      lang
      value
    }
    scheduled_stop_point {
      ...scheduled_stop_point_detail_fields
    }
    keyValues {
      key
      values
    }
    infoSpots {
      ...info_spot_details
    }
    geometry {
      type
      coordinates
    }
    placeEquipments {
      id
      generalSign {
        id
        content {
          value
        }
      }
      shelterEquipment {
        id
        shelterNumber
      }
    }
  }

  fragment terminal_external_links_details on stop_registry_stopPlaceExternalLink {
    stopPlaceId
    orderNum
    name
    location
  }

  fragment terminal_organization_ref on stop_registry_StopPlaceOrganisationRef {
    organisationRef
    relationshipType
    organisation {
      ...stop_place_organisation_fields
    }
  }
`;

export function getEnrichedParentStopPlace(
  parentStopPlace: ParentStopPlaceDetailsFragment | null | undefined,
): EnrichedParentStopPlace | null {
  if (!parentStopPlace) {
    return null;
  }

  return {
    ...parentStopPlace,
    ...getParentStopPlaceDetailsForEnrichment(
      parentStopPlace as StopRegistryParentStopPlace,
    ),
  } as EnrichedParentStopPlace;
}

function useGetParentStopPlaceDetailsByWhere(
  where: StopsDatabaseStopPlaceNewestVersionBoolExp | null,
) {
  const { data, ...rest } = useGetParentStopPlaceDetailsQuery(
    where ? { variables: { where } } : { skip: true },
  );

  const rawParentStopPlace =
    getParentStopPlacesFromQueryResult<ParentStopPlaceDetailsFragment>(
      data?.stopsDb?.newestVersion.at(0)?.TiamatStopPlace,
    ).at(0);
  const parentStopPlaceDetails = useMemo(
    () => getEnrichedParentStopPlace(rawParentStopPlace),
    [rawParentStopPlace],
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
  const validResult = useGetParentStopPlaceDetailsByWhere(
    useGetParentStopPlaceDetailsWhereConditionsWithDate(),
  );

  const fallbackResult = useGetParentStopPlaceDetailsByWhere(
    useGetParentStopPlaceDetailsWhereConditions(),
  );

  if (validResult.parentStopPlaceDetails && !validResult.error) {
    return { ...validResult, isValidOnObservationDate: true };
  }

  if (fallbackResult.parentStopPlaceDetails && !fallbackResult.error) {
    return { ...fallbackResult, isValidOnObservationDate: false };
  }

  return { ...validResult, isValidOnObservationDate: false };
}
