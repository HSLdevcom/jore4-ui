import { DateTime } from 'luxon';
import { useAppDispatch, useObservationDateQueryParam } from '../../../hooks';
import {
  MapEntityEditorViewState,
  resetMapState,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { useUpdateStopPriorityFilterIfNeeded } from '../../map/stops/hooks/useUpdateStopPriorityFilterIfNeeded';
import { useEnsureStopVehicleModeVisible } from '../../map/utils/useEnsureStopVehicleModeVisible';
import { useNavigateToMap } from '../../map/utils/useNavigateToMap';
import { LocatableStop } from '../types';

export function useShowStopOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate: currentObservationDate } =
    useObservationDateQueryParam({
      initialize: false,
    });
  const navigateToMap = useNavigateToMap();
  const ensureVehicleModeVisible = useEnsureStopVehicleModeVisible();
  const updatePriorityFilterIfNeeded = useUpdateStopPriorityFilterIfNeeded();

  return (
    { netexId, location, priority, transportMode }: LocatableStop,
    observeOnDate: DateTime | null = null,
  ) => {
    dispatch(resetMapState()).then(() => {
      if (netexId) {
        dispatch(setSelectedStopIdAction(netexId));
        dispatch(setMapStopViewStateAction(MapEntityEditorViewState.POPUP));
      }

      if (priority !== undefined) {
        updatePriorityFilterIfNeeded(priority);
      }
      ensureVehicleModeVisible(transportMode);

      navigateToMap({
        viewPort: {
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 15,
        },
        filters: {
          observationDate: observeOnDate ?? currentObservationDate,
        },
      });
    });
  };
}
