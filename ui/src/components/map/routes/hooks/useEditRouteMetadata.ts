import { gql, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GetScheduledStopsOnRouteDocument,
  GetScheduledStopsOnRouteQuery,
  GetScheduledStopsOnRouteQueryVariables,
  PatchRouteMutationVariables,
  RouteAllFieldsFragment,
  RouteDefaultFieldsFragment,
  RouteRouteSetInput,
  ServicePatternScheduledStopPoint,
  usePatchRouteMutation,
} from '../../../../generated/graphql';
import { MIN_DATE, mapToISODate } from '../../../../time';
import { Priority } from '../../../../types/enums';
import { RouteDirection } from '../../../../types/RouteDirection';
import {
  defaultLocalizedString,
  illegalCast,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../../common/hooks';
import { RouteFormState } from '../../../forms/route/RoutePropertiesForm.types';
import { useValidateRouteMetadata } from './useValidateRoute';

const GQL_UPDATE_ROUTE = gql`
  mutation PatchRoute($route_id: uuid!, $object: route_route_set_input!) {
    update_route_route(where: { route_id: { _eq: $route_id } }, _set: $object) {
      returning {
        ...RouteAllFields
      }
    }
  }
`;

const GQL_GET_SCHEDULED_STOPS_ON_ROUTE = gql`
  query GetScheduledStopsOnRoute($routeId: uuid!) {
    journey_pattern_journey_pattern(where: { on_route_id: { _eq: $routeId } }) {
      journey_pattern_id
      scheduled_stop_point_in_journey_patterns {
        journey_pattern_id
        scheduled_stop_point_sequence
        scheduled_stop_points {
          ...ScheduledStopPointDefaultFields
        }
      }
    }
  }
`;

type EditParams = {
  readonly routeId: UUID;
  readonly form: RouteFormState;
};

type EditChanges = {
  readonly routeId: UUID;
  readonly patch: RouteRouteSetInput;
  readonly conflicts?: ReadonlyArray<RouteDefaultFieldsFragment>;
};

export function mapRouteFormToInput(state: RouteFormState) {
  return {
    name_i18n: { fi_FI: state.finnishName },
    label: state.label,
    on_line_id: state.onLineId,
    variant: Number.isInteger(state.variant) ? state.variant : null,
    direction: state.direction,
    priority: state.priority,
    version_comment: state.versionComment?.trim() ?? null,
    validity_start: mapDateInputToValidityStart(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
    origin_name_i18n: defaultLocalizedString(state.origin?.name),
    origin_short_name_i18n: defaultLocalizedString(state.origin?.shortName),
    destination_name_i18n: defaultLocalizedString(state.destination?.name),
    destination_short_name_i18n: defaultLocalizedString(
      state.destination?.shortName,
    ),
  };
}

export function mapRouteToFormState(
  route: RouteAllFieldsFragment,
): RouteFormState {
  return {
    finnishName: route.name_i18n?.fi_FI ?? '',
    versionComment: '',
    label: route.label,
    onLineId: route.on_line_id,
    variant: route.variant ?? null,
    direction: route.direction as RouteDirection,
    priority: route.priority,
    validityStart: mapToISODate(route.validity_start) ?? '',
    validityEnd: mapToISODate(route.validity_end) ?? '',
    indefinite: !route.validity_end,
    origin: {
      name: defaultLocalizedString(route.origin_name_i18n),
      shortName: defaultLocalizedString(route.origin_short_name_i18n),
    },
    destination: {
      name: defaultLocalizedString(route.destination_name_i18n),
      shortName: defaultLocalizedString(route.destination_short_name_i18n),
    },
  };
}

/**
 * Hook for editing route's metadata.
 * For editing route geometry (journey pattern and infrastructure links),
 * use editRouteGeometry
 */
export const useEditRouteMetadata = () => {
  const { t } = useTranslation();

  const apollo = useApolloClient();
  const [mutateFunction] = usePatchRouteMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const validateRouteMetadata = useValidateRouteMetadata();

  const prepareEdit = async ({ routeId, form }: EditParams) => {
    const input = mapRouteFormToInput(form);

    await validateRouteMetadata(form);
    const conflicts = await getConflictingRoutes(
      {
        label: form.label,
        priority: form.priority,
        validityStart: input.validity_start ?? MIN_DATE,
        validityEnd: input.validity_end ?? undefined,
        direction: form.direction,
        variant: form.variant,
      },
      routeId,
    );

    return {
      routeId,
      patch: input,
      conflicts,
    };
  };

  // Find all stops on route with draft priority, if the route changes priority from draft
  const findDraftStopsOnRoute = async ({
    routeId,
    oldPriority,
    form,
  }: {
    routeId: UUID;
    oldPriority?: Priority;
    form: RouteFormState;
  }) => {
    const prioChangedFromDraft =
      oldPriority === Priority.Draft && form.priority !== Priority.Draft;

    if (!prioChangedFromDraft) {
      return [];
    }

    const { data } = await apollo.query<
      GetScheduledStopsOnRouteQuery,
      GetScheduledStopsOnRouteQueryVariables
    >({
      query: GetScheduledStopsOnRouteDocument,
      variables: { routeId },
    });

    return data.journey_pattern_journey_pattern
      .flatMap(
        (journeyPattern) =>
          journeyPattern.scheduled_stop_point_in_journey_patterns,
      )
      .flatMap(
        (scheduledStopPointsInJourneyPatterns) =>
          scheduledStopPointsInJourneyPatterns.scheduled_stop_points,
      )
      .map((scheduledStopPoint) =>
        illegalCast<ServicePatternScheduledStopPoint>(scheduledStopPoint),
      )
      .filter((stop) => stop.priority === Priority.Draft);
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchRouteMutationVariables => ({
    route_id: changes.routeId,
    object: changes.patch,
  });

  const editRouteMetadata = (variables: PatchRouteMutationVariables) => {
    return mutateFunction({ variables });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return {
    prepareEditRouteMetadata: prepareEdit,
    findDraftStopsOnRoute,
    mapEditRouteMetadataChangesToVariables: mapEditChangesToVariables,
    editRouteMetadata,
    defaultErrorHandler,
  };
};
