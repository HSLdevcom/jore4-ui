import { gql } from '@apollo/client';
import {
  StopPlaceDetailsFragment,
  StopRegistryStopPlaceInterface,
} from '../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../types';
import { getStopPlaceDetailsForEnrichment } from '../../../../utils';
import { GetUserNameById } from '../../../common/ChangeHistory';

const GQL_FARGMENT_STOP_PLACE_DETAILS = gql`
  fragment StopPlaceDetails on stop_registry_StopPlace {
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
        ...StopPlaceOrganisationFields
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
      ...QuayDetails
    }

    parentStopPlace {
      ...TerminalDetails
    }

    accessibilityAssessment {
      ...AccessibilityAssessmentDetails
    }

    transportMode
    topographicPlace {
      ...TopographicPlaceDetails
    }
    fareZones {
      ...FareZoneDetails
    }

    # Make sure we have all the details needed to display the member rows.
    ...StopTableRowStopAreaDetails
  }

  fragment TerminalDetails on stop_registry_ParentStopPlace {
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
      ...MemberStopStopPlaceDetails
    }
    externalLinks {
      stopPlaceId
      orderNum
      name
      location
    }
  }
`;

export function getEnrichedStopPlace(
  stopPlace: StopPlaceDetailsFragment | null | undefined,
  getUserNameById?: GetUserNameById,
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
