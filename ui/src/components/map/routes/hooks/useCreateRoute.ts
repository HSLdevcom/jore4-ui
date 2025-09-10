import { useTranslation } from 'react-i18next';
import {
  InfrastructureLinkAllFieldsFragment,
  InsertRouteOneMutationVariables,
  JourneyPatternStopFragment,
  RouteDefaultFieldsFragment,
  RouteStopFieldsFragment,
  useInsertRouteOneMutation,
} from '../../../../generated/graphql';
import {
  RouteInfraLink,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../../../graphql';
import { MIN_DATE } from '../../../../time';
import {
  buildJourneyPatternStopSequence,
  mapToObject,
  removeFromApolloCache,
  showDangerToastWithError,
} from '../../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../../common/hooks';
import { RouteFormState } from '../../../forms/route/RoutePropertiesForm.types';
import { mapRouteFormToInput } from './useEditRouteMetadata';
import { useValidateRoute } from './useValidateRoute';

type CreateParams = {
  readonly form: RouteFormState;
  readonly infraLinksAlongRoute: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >;
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  readonly includedStopLabels: ReadonlyArray<string>;
  readonly journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
};

type CreateChanges = {
  readonly input: InsertRouteOneMutationVariables;
  readonly conflicts?: ReadonlyArray<RouteDefaultFieldsFragment>;
};

export const useCreateRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertRouteOneMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const { validateJourneyPattern, validateMetadata } = useValidateRoute();

  const insertRouteMutation = async (
    variables: InsertRouteOneMutationVariables,
  ) => {
    return mutateFunction({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          line_id: variables.object.on_line_id,
          __typename: 'route_line',
        });
      },
    });
  };

  const mapRouteDetailsToInsertMutationVariables = (
    params: CreateParams,
  ): InsertRouteOneMutationVariables => {
    const {
      form,
      infraLinksAlongRoute,
      stopsEligibleForJourneyPattern,
      includedStopLabels,
      journeyPatternStops,
    } = params;

    const input: InsertRouteOneMutationVariables = mapToObject({
      ...mapRouteFormToInput(form),
      // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
      infrastructure_links_along_route: {
        data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
      },
      route_journey_patterns: {
        data: {
          scheduled_stop_point_in_journey_patterns: {
            data: buildJourneyPatternStopSequence({
              stopsEligibleForJourneyPattern,
              includedStopLabels,
              journeyPatternStops,
            }),
          },
        },
      },
    });

    return input;
  };

  const prepareCreate = async (params: CreateParams) => {
    const { includedStopLabels, form } = params;

    await validateJourneyPattern({ includedStopLabels });
    await validateMetadata(form);

    const input = mapRouteDetailsToInsertMutationVariables(params);
    const conflicts = await getConflictingRoutes({
      // Form validation should make sure that label, priority and direction always exist.
      // For some reason form state is saved as Partial<> so we have to use non-null assertions here...
      label: form.label!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      priority: form.priority!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      validityStart: input.object.validity_start ?? MIN_DATE,
      validityEnd: input.object.validity_end ?? undefined,
      direction: form.direction!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      variant: form.variant,
    });

    const changes: CreateChanges = {
      input,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) => {
    const variables: InsertRouteOneMutationVariables = { ...changes.input };
    return variables;
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertRouteMutation,
    defaultErrorHandler,
  };
};
