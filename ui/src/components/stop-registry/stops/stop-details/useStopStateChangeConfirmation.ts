import { gql, useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import {
  GetSspIdByQuayNetexIdDocument,
  GetSspIdByQuayNetexIdQuery,
  GetSspIdByQuayNetexIdQueryVariables,
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  RouteUniqueFieldsFragment,
} from '../../../../generated/graphql';
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

function useResolveScheduledStopPointId() {
  const apollo = useApolloClient();

  return useCallback(
    async (quayNetexId: string, knownSspId?: string) => {
      if (knownSspId) {
        return knownSspId;
      }

      const { data } = await apollo.query<
        GetSspIdByQuayNetexIdQuery,
        GetSspIdByQuayNetexIdQueryVariables
      >({
        query: GetSspIdByQuayNetexIdDocument,
        variables: { quayNetexId },
      });

      return (
        data?.service_pattern_scheduled_stop_point?.at(0)
          ?.scheduled_stop_point_id ?? null
      );
    },
    [apollo],
  );
}

function useGetAffectedRoutes(
  quayNetexId: string,
  scheduledStopPointId?: string,
) {
  const apollo = useApolloClient();
  const resolveStopPointId = useResolveScheduledStopPointId();

  return useCallback(async (): Promise<
    ReadonlyArray<RouteUniqueFieldsFragment>
  > => {
    const stopPointId = await resolveStopPointId(
      quayNetexId,
      scheduledStopPointId,
    );

    if (!stopPointId) {
      return [];
    }
    const result = await apollo.query<
      GetStopWithRouteGraphDataByIdQuery,
      GetStopWithRouteGraphDataByIdQueryVariables
    >({
      query: GetStopWithRouteGraphDataByIdDocument,
      variables: { stopId: stopPointId },
    });
    const stopData = result.data?.service_pattern_scheduled_stop_point?.[0];
    const journeyPatterns =
      stopData?.scheduled_stop_point_in_journey_patterns ?? [];
    return journeyPatterns.flatMap(
      (jp) => jp.journey_pattern?.journey_pattern_route ?? [],
    );
  }, [apollo, resolveStopPointId, quayNetexId, scheduledStopPointId]);
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
