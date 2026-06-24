import { gql, useLazyQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import {
  RouteUniqueFieldsFragment,
  useGetStopWithRouteGraphDataByIdLazyQuery,
} from '../../../../generated/graphql';
import { mapStopResultToStop } from '../../../../graphql';
import { StopPlaceState } from '../../../../types/stop-registry';

const GQL_GET_SSP_ID_BY_STOP_PLACE_REF = gql`
  query GetSspIdByStopPlaceRef($stopPlaceRef: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopPlaceRef } }
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
  readonly currentStopState: StopPlaceState | null | undefined;
  readonly stopPlaceRef: string;
  readonly scheduledStopPointId?: string;
  readonly doSave: (state: TFormState) => Promise<void>;
  readonly onSuccess: () => void;
  readonly defaultErrorHandler: (err: Error) => void;
};

export function useStopStateChangeConfirmation<
  TFormState extends StopStateFormFields,
>({
  currentStopState,
  stopPlaceRef,
  scheduledStopPointId,
  doSave,
  onSuccess,
  defaultErrorHandler,
}: UseStopStateChangeConfirmationParams<TFormState>) {
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdLazyQuery();
  const [getSspByRef] = useLazyQuery<SspIdByRefResult>(
    GQL_GET_SSP_ID_BY_STOP_PLACE_REF,
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

  const resolveStopPointId = async (): Promise<string | undefined> => {
    if (scheduledStopPointId) {
      return scheduledStopPointId;
    }
    if (!stopPlaceRef) {
      return undefined;
    }
    const { data } = await getSspByRef({
      variables: { stopPlaceRef },
    });
    return data?.service_pattern_scheduled_stop_point?.[0]
      ?.scheduled_stop_point_id;
  };

  const getAffectedRoutes = async (): Promise<
    ReadonlyArray<RouteUniqueFieldsFragment>
  > => {
    const stopPointId = await resolveStopPointId();
    if (!stopPointId) {
      return [];
    }
    const result = await getStopWithRouteGraphData({
      variables: { stopId: stopPointId },
    });
    const stopData = mapStopResultToStop(result);
    if (!stopData) {
      return [];
    }
    const journeyPatterns =
      stopData.scheduled_stop_point_in_journey_patterns ?? [];
    return journeyPatterns.flatMap(
      (jp) => jp.journey_pattern?.journey_pattern_route ?? [],
    );
  };

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
