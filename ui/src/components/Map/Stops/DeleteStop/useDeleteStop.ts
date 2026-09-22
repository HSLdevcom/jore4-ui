import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  useRemoveStopMutation,
} from '../../../../generated/graphql';
import {
  EditRouteTerminalStopsError,
  showDangerToast,
  showDangerToastWithError,
} from '../../../../utils';
import { useDeleteQuay } from '../../../StopRegistry/Stops/Queries';
import { useGetStopWithRoutes } from '../utils';

const GQL_REMOVE_STOP = gql`
  mutation RemoveStop($stop_id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

type DeleteParams = {
  readonly stopPointId: UUID;
  readonly stopPlaceId: string;
  readonly quayId: string;
};

export type DeleteChanges = DeleteParams & {
  readonly deletedStopPoint: ServicePatternScheduledStopPoint;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

// Prepare variables for mutation and validate if it's even allowed.
// Try to produce a changeset that can be displayed on an explanatory UI.
function usePrepareDelete() {
  const getStopWithRoutes = useGetStopWithRoutes();

  return async (deleteParams: DeleteParams) => {
    // Check if we tried to delete the starting or ending stop of an existing route.
    const { stop, routes } = await getStopWithRoutes(deleteParams.stopPointId);

    const changes: DeleteChanges = {
      ...deleteParams,
      deletedStopPoint: stop,
      deleteStopFromRoutes: routes,
    };

    return changes;
  };
}

export function useDeleteStop() {
  const { t } = useTranslation();

  const prepareDelete = usePrepareDelete();
  const [removeStopMutation] = useRemoveStopMutation();
  const deleteQuay = useDeleteQuay();

  const removeStop = async ({
    stopPointId,
    stopPlaceId,
    quayId,
  }: DeleteChanges) => {
    const removedStopPointResult = await removeStopMutation({
      variables: { stop_id: stopPointId },
    });

    const removedQuayResult = await deleteQuay(stopPlaceId, quayId);

    return { removedStopPointResult, removedQuayResult };
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t(($) => $.stops.cannotEditTerminalStops));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return { prepareDelete, removeStop, defaultErrorHandler };
}
