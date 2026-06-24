import { gql, useLazyQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import {
  RouteUniqueFieldsFragment,
  useGetStopWithRouteGraphDataByIdLazyQuery,
} from '../../../../generated/graphql';
import { mapStopResultToStop } from '../../../../graphql';
import { StopPlaceState } from '../../../../types/stop-registry';

const GQL_GET_SSP_ID_BY_QUAY_NETEX_ID = gql`
  query GetSspIdByQuayNetexId($quayNetexId: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $quayNetexId } }
      limit: 1
    ) {
      scheduled_stop_point_id
    }
  }
`;

type SspIdByRefResult = {
  service_pattern_scheduled_stop_point: ReadonlyArray<{
    scheduled_stop_point_id: string;
  }>;
};

type StopStateFormFields = {
  readonly stopState: StopPlaceState;
};

type ConfirmationState<TFormState> = {
  readonly isOpen: boolean;
  readonly state: TFormState | null;
  readonly affectedRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

type UseStopStateChangeConfirmationParams<
  TFormState extends StopStateFormFields,
> = {
  readonly currentStopState: StopPlaceState;
  readonly quayNetexId: string;
  readonly scheduledStopPointId?: string;
  readonly doSave: (state: TFormState) => Promise<void>;
  readonly onSuccess: () => void;
  readonly defaultErrorHandler: (err: Error) => void;
};

function useGetAffectedRoutes(
  quayNetexId: string,
  scheduledStopPointId?: string,
) {
  const [getSspByRef] = useLazyQuery<SspIdByRefResult>(
    GQL_GET_SSP_ID_BY_QUAY_NETEX_ID,
  );
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdLazyQuery();

  return useCallback(async (): Promise<
    ReadonlyArray<RouteUniqueFieldsFragment>
  > => {
    const stopPointId =
      scheduledStopPointId ??
      (await getSspByRef({ variables: { quayNetexId } })).data
        ?.service_pattern_scheduled_stop_point?.[0]?.scheduled_stop_point_id;

    if (!stopPointId) {
      return [];
    }
    const result = await getStopWithRouteGraphData({
      variables: { stopId: stopPointId },
    });
    const stopData = mapStopResultToStop(result);
    const journeyPatterns =
      stopData?.scheduled_stop_point_in_journey_patterns ?? [];
    return journeyPatterns.flatMap(
      (jp) => jp.journey_pattern?.journey_pattern_route ?? [],
    );
  }, [
    getSspByRef,
    getStopWithRouteGraphData,
    quayNetexId,
    scheduledStopPointId,
  ]);
}

export function useStopStateChangeConfirmation<
  TFormState extends StopStateFormFields,
>({
  currentStopState,
  quayNetexId,
  scheduledStopPointId,
  doSave,
  onSuccess,
  defaultErrorHandler,
}: UseStopStateChangeConfirmationParams<TFormState>) {
  const getAffectedRoutes = useGetAffectedRoutes(
    quayNetexId,
    scheduledStopPointId,
  );

  const [confirmationState, setConfirmationState] = useState<
    ConfirmationState<TFormState>
  >({ isOpen: false, state: null, affectedRoutes: [] });

  const isChangingToInactive = useCallback(
    (state: TFormState): boolean =>
      currentStopState === StopPlaceState.InOperation &&
      state.stopState !== StopPlaceState.InOperation,
    [currentStopState],
  );

  const performSave = async (state: TFormState) => {
    await doSave(state);
    onSuccess();
  };

  const onSubmit = async (state: TFormState) => {
    try {
      if (isChangingToInactive(state)) {
        const affectedRoutes = await getAffectedRoutes();
        setConfirmationState({ isOpen: true, state, affectedRoutes });
      } else {
        await performSave(state);
      }
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const onConfirmStateChange = async () => {
    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
    if (!confirmationState.state) {
      return;
    }
    try {
      await performSave(confirmationState.state);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const onCancelStateChange = () => {
    setConfirmationState({ isOpen: false, state: null, affectedRoutes: [] });
  };

  return {
    onSubmit,
    confirmationDialogProps: {
      isOpen: confirmationState.isOpen,
      onConfirm: onConfirmStateChange,
      onCancel: onCancelStateChange,
      affectedRoutes: confirmationState.affectedRoutes,
    },
  };
}
