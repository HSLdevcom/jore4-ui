import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import maxBy from 'lodash/maxBy';
import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import {
  GetStopDetailsQuery,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInterface,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useGetStopDetailsLazyQuery,
  useGetStopDetailsQuery,
} from '../../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useUrlQuery,
} from '../../../../hooks/urlQuery';
import { useGetUserNames } from '../../../../hooks/useGetUserNames';
import { useRequiredParams } from '../../../../hooks/useRequiredParams';
import {
  EnrichedStopPlace,
  Quay,
  StopPlace,
  StopWithDetails,
} from '../../../../types';
import { Priority } from '../../../../types/enums';
import {
  KnownValueKey,
  findKeyValue,
  getGeometryPoint,
  getStopPlaceDetailsForEnrichment,
  getStopPlacesFromQueryResult,
} from '../../../../utils';
import { mapToEnrichedQuay } from '../../utils';
import { useGetLatestQuayChange } from '../queries/useGetQuayChangeHistory';

const GQL_SCHEDULED_STOP_POINT_DETAIL_FIELDS = gql`
  fragment scheduled_stop_point_detail_fields on service_pattern_scheduled_stop_point {
    priority
    direction
    scheduled_stop_point_id
    label
    timing_place_id
    timing_place {
      timing_place_id
      label
    }
    validity_start
    validity_end
    located_on_infrastructure_link_id
    stop_place_ref
    measured_location
    vehicle_mode_on_scheduled_stop_point {
      vehicle_mode
    }
  }
`;

const GQL_GET_STOP_DETAILS = gql`
  query GetStopDetails(
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      newestVersion: stops_database_stop_place_newest_version(where: $where) {
        id
        TiamatStopPlace {
          ...stop_place_details
          ... on stop_registry_StopPlace {
            quays {
              ...quay_details
            }
          }
        }
      }
    }
  }
`;

const GQL_SHELTER_EQUIPMENT_DETAILS = gql`
  fragment shelter_equipment_details on stop_registry_ShelterEquipment {
    id
    version

    enclosed
    stepFree
    shelterNumber
    shelterType
    shelterElectricity
    shelterLighting
    shelterCondition
    timetableCabinets
    trashCan
    shelterHasDisplay
    bicycleParking
    leaningRail
    outsideBench
    shelterFasciaBoardTaping
    shelterExternalId
  }
`;

const GQL_HSL_ACCESSIBILITY_ASSESSMENT_DETAILS = gql`
  fragment accessibility_assessment_details on stop_registry_AccessibilityAssessment {
    id
    version

    hslAccessibilityProperties {
      ...hsl_accessibility_properties_details
    }
    limitations {
      id
      version

      audibleSignalsAvailable
      escalatorFreeAccess
      liftFreeAccess
      stepFreeAccess
      wheelchairAccess
    }
  }
`;

const GQL_QUAY_DETAILS = gql`
  fragment quay_details on stop_registry_Quay {
    id
    version

    publicCode
    privateCode {
      type
      value
    }
    description {
      lang
      value
    }
    alternativeNames {
      name {
        lang
        value
      }
      nameType
    }
    geometry {
      coordinates
      type
    }
    accessibilityAssessment {
      ...accessibility_assessment_details
    }
    keyValues {
      key
      values
    }
    infoSpots {
      ...info_spot_details
    }
    placeEquipments {
      id
      shelterEquipment {
        ...shelter_equipment_details
      }
      cycleStorageEquipment {
        id
        version

        cycleStorageType
      }
      generalSign {
        id
        version

        privateCode {
          value
          type
        }
        content {
          value
        }
        signContentType
        numberOfFrames
        replacesRailSign
        note {
          lang
          value
        }
      }
    }
    scheduled_stop_point {
      ...scheduled_stop_point_detail_fields
    }
    externalLinks {
      ...external_links_details
    }
    organisations {
      relationshipType
      organisationRef
      organisation {
        ...stop_place_organisation_fields
      }
    }
  }
`;

const GQL_EXTERNAL_LINKS_DETAILS = gql`
  fragment external_links_details on stop_registry_externalLink {
    quayId
    orderNum
    name
    location
  }
`;

const GQL_TOPOGRAPHIC_PLACE_DETAILS = gql`
  fragment topographic_place_details on stop_registry_TopographicPlace {
    id
    version

    topographicPlaceType
    name {
      value
      lang
    }
  }
`;

const GQL_FARE_ZONE_DETAILS = gql`
  fragment fare_zone_details on stop_registry_FareZone {
    id
    version

    name {
      value
      lang
    }
  }
`;

const GQL_HSL_ACCESSIBILITY_PROPERTIES_DETAILS = gql`
  fragment hsl_accessibility_properties_details on stop_registry_HslAccessibilityProperties {
    id
    version

    stopAreaSideSlope
    stopAreaLengthwiseSlope
    endRampSlope
    shelterLaneDistance
    curbBackOfRailDistance
    curbDriveSideOfRailDistance
    structureLaneDistance
    stopElevationFromRailTop
    stopElevationFromSidewalk
    lowerCleatHeight
    serviceAreaWidth
    serviceAreaLength
    platformEdgeWarningArea
    guidanceTiles
    guidanceStripe
    serviceAreaStripes
    sidewalkAccessibleConnection
    stopAreaSurroundingsAccessible
    curvedStop
    stopType
    shelterType
    guidanceType
    mapType
    pedestrianCrossingRampType
    accessibilityLevel
  }
`;

const GQL_STOP_PLACE_ORGANISATION_FIELDS = gql`
  fragment stop_place_organisation_fields on stop_registry_Organisation {
    id
    version

    name
    privateContactDetails {
      id
      version

      email
      phone
    }
  }
`;

const GQL_INFO_SPOT_DETAILS = gql`
  fragment info_spot_details on stop_registry_infoSpot {
    id
    version

    backlight
    description {
      lang
      value
    }
    displayType
    floor
    label
    width
    height
    infoSpotLocations
    infoSpotType
    purpose
    railInformation
    speechProperty
    zoneLabel
    poster {
      id
      version

      label
      width
      height
      lines
    }
    geometry {
      type
      coordinates
    }
  }
`;

const getEnrichedStopPlace = (
  stopPlace: StopPlace | null,
): EnrichedStopPlace | null => {
  if (!stopPlace) {
    return null;
  }

  const transformedStopPlace = {
    ...stopPlace,
    parentStopPlace: stopPlace.parentStopPlace
      ? [stopPlace.parentStopPlace as StopRegistryStopPlaceInterface]
      : undefined,
  };

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(transformedStopPlace),
  };
};

function validOn(observationDateTs: number) {
  return (quay: Quay) => {
    const validityStart = quay.scheduled_stop_point?.validity_start;
    const validityEnd = quay.scheduled_stop_point?.validity_end;

    if (!validityStart || validityStart.valueOf() > observationDateTs) {
      return false;
    }

    if (validityEnd && validityEnd.valueOf() < observationDateTs) {
      return false;
    }

    return true;
  };
}

function getCorrectQuay(
  quays: ReadonlyArray<Quay | null | undefined> | null | undefined,
  requestedPublicCode: string,
  observationDateTs: number,
  priority: number,
): Quay | null {
  const validQuays = compact(quays)
    .filter((it) => it.publicCode === requestedPublicCode)
    .filter(validOn(observationDateTs));

  if (Number.isFinite(priority)) {
    return (
      validQuays.find(
        (quay) =>
          findKeyValue(quay, KnownValueKey.Priority) === String(priority),
      ) ?? null
    );
  }

  // Ignore drafts by default. Only show if requested separately by priority query param.
  // This is to align the behaviour of the page with how the map works.
  const nonDraftQuays = validQuays.filter(
    (quay) =>
      Number(findKeyValue(quay, KnownValueKey.Priority)) !== Priority.Draft,
  );
  return (
    maxBy(nonDraftQuays, (quay) =>
      Number(findKeyValue(quay, KnownValueKey.Priority)),
    ) ?? null
  );
}

const getStopDetails = (
  data: GetStopDetailsQuery | undefined,
  observationDateTs: number,
  priority: number,
  label: string,
  getUserNameById: (userId: string | null | undefined) => string | null,
  quayChangeData?: {
    changed: string | null;
    changedBy: string | null;
  },
): StopWithDetails | null => {
  const stopPlaceResults = data?.stopsDb?.newestVersion ?? [];

  const result = compact(
    stopPlaceResults.map((stopPlaceResult) => {
      const [stopPlace] = getStopPlacesFromQueryResult<StopPlace>(
        stopPlaceResult.TiamatStopPlace,
      );

      if (!stopPlace) {
        return null;
      }

      const selectedQuay = getCorrectQuay(
        stopPlace.quays,
        label,
        observationDateTs,
        priority,
      );

      const stopPoint = selectedQuay?.scheduled_stop_point;

      return stopPoint ? { stopPoint, stopPlace, selectedQuay } : null;
    }),
  ).at(0);

  if (!result) {
    return null;
  }

  const changeData = quayChangeData;
  const changedByUserName = getUserNameById(changeData?.changedBy);

  return {
    ...result.stopPoint,
    location: getGeometryPoint(result.stopPoint.measured_location),
    stop_place: getEnrichedStopPlace(result.stopPlace),
    quay: mapToEnrichedQuay(
      result.selectedQuay,
      result.stopPlace?.accessibilityAssessment,
      changeData?.changed,
      changedByUserName,
    ),
  };
};

function getWhereCondition(
  label: string,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  // Find the stop place that contains a quay with this public code
  return {
    stop_place_quays: {
      quay: {
        public_code: { _eq: label },
      },
    },
  };
}

export const useGetStopDetails = () => {
  const { label } = useRequiredParams<{ label: string }>();
  const { observationDate } = useObservationDateQueryParam();
  const { queryParams } = useUrlQuery();
  const priority = Number(queryParams.priority);
  const { getUserNameById } = useGetUserNames();

  const where = getWhereCondition(label);
  const { data, ...rest } = useGetStopDetailsQuery({ variables: { where } });

  const { latestQuayChangeData } = useGetLatestQuayChange({
    public_code: { _eq: label },
  });

  const observationDateTs = observationDate.valueOf();
  const stopDetails = useMemo(
    () =>
      getStopDetails(
        data,
        observationDateTs,
        priority,
        label,
        getUserNameById,
        latestQuayChangeData,
      ),
    [
      data,
      observationDateTs,
      priority,
      label,
      getUserNameById,
      latestQuayChangeData,
    ],
  );

  return { ...rest, stopDetails };
};

export const useGetStopDetailsLazy = () => {
  const [getStopDetailsLazy] = useGetStopDetailsLazyQuery();
  const { getUserNameById } = useGetUserNames();

  return useCallback(
    async (
      label: string,
      observationDate: DateTime,
      priority: number,
      quayChangeData?: {
        changed: string | null;
        changedBy: string | null;
      },
    ) => {
      const where = getWhereCondition(label);
      const { data, ...rest } = await getStopDetailsLazy({
        variables: { where },
      });

      const observationDateTs = observationDate.valueOf();
      const stopDetails = getStopDetails(
        data,
        observationDateTs,
        priority,
        label,
        getUserNameById,
        quayChangeData,
      );

      return { ...rest, stopDetails };
    },
    [getStopDetailsLazy, getUserNameById],
  );
};

export const getQuayIdsFromStopExcept = (
  stop: StopWithDetails | null,
  quayId: string | null | undefined,
): Array<StopRegistryQuayInput> =>
  stop?.stop_place?.quays
    ?.map((quay) => quay?.id)
    .filter((id) => id !== quayId)
    .map((id) => ({ id })) ?? [];
