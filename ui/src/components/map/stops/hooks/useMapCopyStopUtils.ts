import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAppAction, useAppSelector } from '../../../../hooks';
import {
  MapEntityEditorViewState,
  closeTimingPlaceModalAction,
  selectCopyStopId,
  selectDraftLocation,
  setCopyStopIdAction,
  setDraftLocationAction,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
} from '../../../../redux';
import { isDateInRange, parseDate } from '../../../../time';
import { Point } from '../../../../types';
import { showDangerToast, showWarningToast } from '../../../../utils';
import { StopFormState } from '../../../forms/stop';
import { StopInfoForEditingOnMap } from '../../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import {
  mapStopFormStateToInputs,
  useCopyStop,
} from '../../../stop-registry/stops/stop-details/stop-version/utils';
import { useGetStopDetailsLazy } from '../../../stop-registry/stops/stop-details/useGetStopDetails';
import { useMapUrlStateContext } from '../../utils/mapUrlState';
import { CreateChanges } from './useCreateStop';

function useDefaultValues(
  draftLocation: Point | null,
  stopInfo: StopInfoForEditingOnMap | null,
): Partial<StopFormState> | null {
  return useMemo(() => {
    if (draftLocation && stopInfo) {
      return {
        ...stopInfo.formState,
        ...draftLocation,

        // We need to set these to null to make stopForm think we are creating a new stop
        quayId: undefined,
        stopId: undefined,
      };
    }

    return null;
  }, [draftLocation, stopInfo]);
}

export function useMapCopyStopUtils(
  stopInfo: StopInfoForEditingOnMap | null,
  onCopyFinished: (netexId: string) => void,
  onPopupClose: () => void,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
) {
  const { t } = useTranslation();

  const {
    state: {
      filters: { observationDate },
    },
    setFlatUrlState,
  } = useMapUrlStateContext();

  const copyStopId = useAppSelector(selectCopyStopId);
  const draftLocation = useAppSelector(selectDraftLocation);

  const dispatch = useDispatch();
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setCopyStopId = useAppAction(setCopyStopIdAction);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);
  const setDraftStopLocation = useAppAction(setDraftLocationAction);

  const getStopDetails = useGetStopDetailsLazy();
  const copyStop = useCopyStop();

  const defaultValues = useDefaultValues(draftLocation ?? null, stopInfo);

  const onStartCopyStop = () => {
    if (!copyStopId) {
      return;
    }

    setDialogOpen(false);
    setSelectedStopId(undefined);
    setDraftStopLocation(undefined);
    setMapStopViewState(MapEntityEditorViewState.PLACECOPY);
  };

  const onCancelCopyStop = () => {
    setDialogOpen(false);
    setSelectedStopId(copyStopId);
    setCopyStopId(undefined);
    setDraftStopLocation(undefined);
  };

  const onCloseCopyModal = () => {
    onCancelCopyStop();

    if (stopInfo) {
      setMapStopViewState(MapEntityEditorViewState.POPUP);
    } else {
      setMapStopViewState(MapEntityEditorViewState.NONE);
      dispatch(closeTimingPlaceModalAction());
      onPopupClose();
    }
  };

  const onCopyStopFormSubmit = async (
    changes: CreateChanges,
    state: StopFormState,
  ) => {
    // There are conflicts, don't copy and warn the user
    if (changes.conflicts?.length) {
      showDangerToast(t('stops.stopConflictsOnCopyError'));
      return;
    }

    const publicCode = defaultValues?.publicCode?.value;
    const priority = defaultValues?.priority;
    if (!publicCode || !priority) {
      return;
    }

    const { stopDetails } = await getStopDetails(
      publicCode ?? '',
      observationDate,
      priority,
    );

    if (!stopDetails) {
      throw new Error('Stop details not found for copied stop!');
    }

    const { quayInput, stopPointInput, infoSpotInputs, originalStopPlaceId } =
      mapStopFormStateToInputs(state, stopDetails);

    const { quayId } = await copyStop({
      originalStopPlaceId,
      quayInput,
      stopPointInput,
      infoSpotInputs,
    });

    if (
      !isDateInRange(
        observationDate,
        parseDate(state.validityStart),
        parseDate(state.validityEnd),
      )
    ) {
      setFlatUrlState((p) => ({
        ...p,
        observationDate:
          parseDate(state.validityStart) ??
          parseDate(state.validityEnd) ??
          observationDate,
      }));
      showWarningToast(t('filters.observationDateAdjusted'));
    }

    setCopyStopId(undefined);
    setDialogOpen(false);
    onCopyFinished(quayId);
  };

  return {
    defaultStopFormValues: defaultValues,
    onStartCopyStop,
    onCancelCopyStop,
    onCloseCopyModal,
    onCopyStopFormSubmit,
  };
}
