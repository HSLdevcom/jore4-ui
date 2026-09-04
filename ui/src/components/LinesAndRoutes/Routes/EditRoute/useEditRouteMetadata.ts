import { gql, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GetScheduledStopsOnRouteDocument,
  GetScheduledStopsOnRouteQuery,
  GetScheduledStopsOnRouteQueryVariables,
  RouteDefaultFieldsFragment,
  RouteRouteSetInput,
  ServicePatternScheduledStopPoint,
  usePatchRouteMutation,
} from '../../../../generated/graphql';
import { MIN_DATE } from '../../../../time';
import { Priority } from '../../../../types/enums';
import { illegalCast, showDangerToastWithError } from '../../../../utils';
import {
  RouteFormState,
  mapRouteFormToInput,
  useGetConflictingRoutes,
  useValidateRouteMetadata,
} from '../../Common';

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

/**
 * Hook for editing route's metadata.
 * For editing route geometry (journey pattern and infrastructure links),
 * use editRouteGeometry
 */
export function useEditRouteMetadata() {
  const { t } = useTranslation();

  const apollo = useApolloClient();
  const [mutateFunction] = usePatchRouteMutation();
  const getConflictingRoutes = useGetConflictingRoutes();
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

  const editRouteMetadata = (changes: EditChanges) =>
    mutateFunction({
      variables: {
        route_id: changes.routeId,
        object: changes.patch,
      },
    });

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
    editRouteMetadata,
    defaultErrorHandler,
  };
}
