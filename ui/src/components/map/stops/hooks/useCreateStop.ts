import { gql } from '@apollo/client';
import type { Point } from 'geojson';
import {
  ReusableComponentsVehicleModeEnum,
  ScheduledStopPointDefaultFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryQuayInput,
  useInsertQuayIntoStopPlaceMutation,
  useInsertStopPointMutation,
  useQueryAnyClosestLinkLazyQuery,
} from '../../../../generated/graphql';
import { mapAnyClosestLinkResult } from '../../../../graphql';
import { OptionalKeys } from '../../../../types';
import {
  IncompatibleWithExistingRoutesError,
  KnownValueKey,
  LinkNotResolvedError,
  findKeyValue,
  getRouteLabelVariantText,
} from '../../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../../common/hooks';
import {
  BrokenRouteCheckParams,
  useGetRoutesBrokenByStopChange,
} from './useEditStop';
import { useGetNextQuayPrivateCode } from './useGetNextQuayPrivateCode';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';

// the input does not need to contain all the fields
export type CreateStopPointInput = OptionalKeys<
  ServicePatternScheduledStopPointInsertInput,
  'direction' | 'located_on_infrastructure_link_id'
>;

type CreateParams = {
  readonly stopPoint: CreateStopPointInput;
  readonly stopPlaceId: string;
  readonly quay: StopRegistryQuayInput;
};

export type CreateChanges = {
  readonly conflicts?: ReadonlyArray<ScheduledStopPointDefaultFieldsFragment>;
  readonly stopPoint: ServicePatternScheduledStopPointInsertInput;
  readonly stopPlaceId: string;
  readonly quay: StopRegistryQuayInput;
};

const GQL_INSERT_STOP_POINT = gql`
  mutation InsertStopPoint(
    $stopPoint: service_pattern_scheduled_stop_point_insert_input!
  ) {
    stopPoint: insert_service_pattern_scheduled_stop_point_one(
      object: $stopPoint
    ) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      priority
      measured_location
      label
      validity_start
      validity_end
      stop_place_ref
    }
  }
`;

function useCheckForBrokenRoutes() {
  const getRoutesBrokenByStopChange = useGetRoutesBrokenByStopChange();

  // if added stop conflicts with existing routes, warn user.
  // for example, if a stop with same label has already been added to a route,
  // but new stop is not located on that route's geometry, the stop cannot be added
  return async (params: BrokenRouteCheckParams) => {
    const { brokenRoutes } = await getRoutesBrokenByStopChange(params);

    if (brokenRoutes?.length) {
      throw new IncompatibleWithExistingRoutesError(
        brokenRoutes.map((route) => getRouteLabelVariantText(route)).join(', '),
      );
    }
  };
}

export function usePrepareCreate() {
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const getNextQuayPrivateCode = useGetNextQuayPrivateCode();

  const checkForBrokenRoutes = useCheckForBrokenRoutes();

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  return async ({
    stopPoint,
    stopPlaceId,
    quay,
  }: CreateParams): Promise<CreateChanges> => {
    const [conflicts, { closestLink, direction }, privateCodeValue] =
      await Promise.all([
        getConflictingStops({
          // these form values always exist
          label: stopPoint.label,
          priority: stopPoint.priority,
          validityStart: stopPoint.validity_start ?? undefined,
          validityEnd: stopPoint.validity_end ?? undefined,
        }),

        // we need to fetch the infra link and direction for the stop
        getStopLinkAndDirection({
          stopLocation: stopPoint.measured_location,
          vehicleMode:
            stopPoint.vehicle_mode_on_scheduled_stop_point?.data?.[0]
              ?.vehicle_mode ?? ReusableComponentsVehicleModeEnum.Bus,
        }),

        // next private code
        getNextQuayPrivateCode(),
      ]);

    // check if any routes are broken if this stops is added
    await checkForBrokenRoutes({
      newLink: closestLink,
      newDirection: direction,
      newStop: stopPoint,
      label: stopPoint.label,
      priority: stopPoint.priority,
      stopId: null,
    });

    const stopPointWithInfraInfo: ServicePatternScheduledStopPointInsertInput =
      {
        ...stopPoint,
        located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
        direction,
      };

    return {
      stopPoint: stopPointWithInfraInfo,
      conflicts,
      stopPlaceId,
      quay: {
        ...quay,
        privateCode: {
          value: privateCodeValue,
          type: 'HSL/JORE-4',
        },
      },
    };
  };
}

export function useCheckIsLocationValidForStop() {
  const [fetchAnyClosestLink] = useQueryAnyClosestLinkLazyQuery();

  // Checks if the given location is near any infrastructure link at all.
  return async (stopLocation: Point): Promise<true> => {
    const result = await fetchAnyClosestLink({
      variables: { point: stopLocation },
    });
    if (!mapAnyClosestLinkResult(result)) {
      throw new LinkNotResolvedError(
        result.error,
        `Could not resolve closest link to point ${stopLocation}`,
      );
    }
    return true;
  };
}

export function useCreateStop() {
  const [insertStopPointMutation] = useInsertStopPointMutation();
  const [insertQuayIntoStopPlaceMutation] = useInsertQuayIntoStopPlaceMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      'getStopPlaceDetails',
      'GetStopInfoForEditingOnMap',
      'GetMapStops',
    ],
  });

  return async ({ stopPlaceId, quay, stopPoint }: CreateChanges) => {
    const insertQuayResult = await insertQuayIntoStopPlaceMutation({
      variables: { stopPlaceId, quayInput: quay },
    });

    const quayId = insertQuayResult.data?.stop_registry?.mutateStopPlace
      ?.at(0)
      ?.quays?.find(
        (it) =>
          it &&
          findKeyValue(it, KnownValueKey.ImportedId) ===
            findKeyValue(quay, KnownValueKey.ImportedId),
      )?.id;

    // This should never be true
    if (!quayId) {
      throw new Error(
        'StopPlace mutation did not fail, but the to be inserted Quay was not found from the response!',
      );
    }

    const insertedStopPointResult = await insertStopPointMutation({
      variables: {
        stopPoint: {
          ...stopPoint,
          stop_place_ref: quayId,
        },
      },
    });

    const stopPointId =
      insertedStopPointResult.data?.stopPoint?.scheduled_stop_point_id;

    // This should never be true
    if (!stopPointId) {
      throw new Error(
        'StopPoint insert did not fail, but the to be inserted StopPoint was not found from the response!',
      );
    }

    return { quayId, stopPointId };
  };
}
