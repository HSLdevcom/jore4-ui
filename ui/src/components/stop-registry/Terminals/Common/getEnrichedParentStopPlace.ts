import { gql } from '@apollo/client';
import {
  ParentStopPlaceDetailsFragment,
  StopRegistryParentStopPlace,
} from '../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../types';
import { getParentStopPlaceDetailsForEnrichment } from '../../../../utils';
import { GetUserNameById } from '../../../common/ChangeHistory';

const GQL_FRAGMENT_PARENT_STOP_PLACE_DETAILS = gql`
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
