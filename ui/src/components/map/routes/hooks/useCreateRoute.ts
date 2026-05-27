import { useApolloClient } from '@apollo/client';
import {
  InfrastructureLinkAllFieldsFragment,
  InsertRouteOneMutationVariables,
  JourneyPatternStopFragment,
  RouteDefaultFieldsFragment,
  RouteStopFieldsFragment,
  RouteTypeOfLineEnum,
  useInsertRouteOneMutation,
} from '../../../../generated/graphql';
import {
  RouteInfraLink,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../../../graphql';
import { MIN_DATE } from '../../../../time';
import { Priority } from '../../../../types/enums';
import {
  buildJourneyPatternStopSequence,
  mapToObject,
} from '../../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../../common/hooks';
import { RouteFormState } from '../../../forms/route/RoutePropertiesForm.types';
import {
  StopMetaTypeUpdateInfo,
  filterNeedUpdateByLineType,
  lineTypeAffectsMetatypes,
  resolveStopInfoByPublicCodes,
} from '../../../routes-and-lines/common/useUpdateStopRegistryStopMetatype';
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
  readonly lineType: RouteTypeOfLineEnum | null;
};

export type CreateChanges = {
  readonly input: InsertRouteOneMutationVariables;
  readonly conflicts: ReadonlyArray<RouteDefaultFieldsFragment>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
};

function mapRouteDetailsToInsertMutationVariables({
  form,
  infraLinksAlongRoute,
  stopsEligibleForJourneyPattern,
  includedStopLabels,
  journeyPatternStops,
}: CreateParams): InsertRouteOneMutationVariables {
  return mapToObject({
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
}

export const useCreateRoute = () => {
  const client = useApolloClient();
  const [mutateFunction] = useInsertRouteOneMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const { validateJourneyPattern, validateMetadata } = useValidateRoute();

  const insertRouteMutation = ({ input: variables }: CreateChanges) =>
    mutateFunction({ variables });

  const getStopsNeedingUpdate = async (
    routePriority: Priority,
    lineType: RouteTypeOfLineEnum | null,
    stopPointLabels: ReadonlyArray<string>,
  ): Promise<ReadonlyArray<StopMetaTypeUpdateInfo>> => {
    if (
      routePriority < Priority.Draft && // Draft should not change the stop type.
      lineTypeAffectsMetatypes(lineType)
    ) {
      const updatableStops = await resolveStopInfoByPublicCodes(
        client,
        stopPointLabels,
      );
      return updatableStops.filter(filterNeedUpdateByLineType(lineType));
    }

    return [];
  };

  const prepareCreate = async (
    params: CreateParams,
  ): Promise<CreateChanges> => {
    const { includedStopLabels, form } = params;

    await validateJourneyPattern({ includedStopLabels });
    await validateMetadata(form);

    const input = mapRouteDetailsToInsertMutationVariables(params);
    const conflicts = await getConflictingRoutes({
      // Form validation should make sure that label, priority and direction always exist.
      // For some reason form state is saved as Partial<> so we have to use non-null assertions here...
      label: form.label,
      priority: form.priority,
      validityStart: input.object.validity_start ?? MIN_DATE,
      validityEnd: input.object.validity_end ?? undefined,
      direction: form.direction,
      variant: form.variant,
    });

    const stopsNeedingUpdate = await getStopsNeedingUpdate(
      params.form.priority,
      params.lineType,
      includedStopLabels,
    );

    return { input, conflicts, stopsNeedingUpdate };
  };

  return { prepareCreate, insertRouteMutation };
};
