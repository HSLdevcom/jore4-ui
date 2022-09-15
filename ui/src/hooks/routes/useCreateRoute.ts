import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  InsertRouteOneMutationVariables,
  RouteRoute,
  useInsertRouteOneMutation,
} from '../../generated/graphql';
import { mapInfraLinksAlongRouteToGraphQL } from '../../graphql';
import { buildStopSequence } from '../../redux';
import { RouteGeometry } from '../../redux/types';
import { MIN_DATE } from '../../time';
import {
  mapToObject,
  removeFromApolloCache,
  showDangerToastWithError,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { mapRouteFormToInput } from './useEditRouteMetadata';
import { useValidateRoute } from './useValidateRoute';

interface CreateParams {
  form: RouteFormState;
  routeGeometry: RouteGeometry;
}

interface CreateChanges {
  input: InsertRouteOneMutationVariables;
  conflicts?: RouteRoute[];
}

export const useCreateRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertRouteOneMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const { validateGeometry, validateMetadata } = useValidateRoute();

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
    const { form, routeGeometry } = params;

    const { infraLinksAlongRoute } = routeGeometry;

    const input: InsertRouteOneMutationVariables = mapToObject({
      ...mapRouteFormToInput(form),
      // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
      infrastructure_links_along_route: {
        data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
      },
      route_journey_patterns: {
        data: {
          scheduled_stop_point_in_journey_patterns:
            buildStopSequence(routeGeometry),
        },
      },
    });

    return input;
  };

  const prepareCreate = async (params: CreateParams) => {
    await validateGeometry(params.routeGeometry);
    await validateMetadata(params.form as RouteFormState);

    const input = mapRouteDetailsToInsertMutationVariables(params);
    const conflicts = await getConflictingRoutes({
      // Form validation should make sure that label, priority and direction always exist.
      // For some reason form state is saved as Partial<> so we have to use non-null assertions here...
      label: params.form.label!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      priority: params.form.priority!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      validityStart: input.object.validity_start || MIN_DATE,
      validityEnd: input.object.validity_end || undefined,
      direction: params.form.direction!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
