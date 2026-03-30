import { useAppDispatch, useObservationDateQueryParam } from '../../../hooks';
import {
  MapEntityEditorViewState,
  resetMapState,
  setMapStopAreaViewStateAction,
  setSelectedMapStopAreaIdAction,
} from '../../../redux';
import { Point } from '../../../types';
import { useEnsureStopVehicleModeVisible } from '../../map/utils/useEnsureStopVehicleModeVisible';
import { useNavigateToMap } from '../../map/utils/useNavigateToMap';

export function useShowStopAreaOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const navigateToMap = useNavigateToMap();
  const ensureVehicleModeVisible = useEnsureStopVehicleModeVisible();

  return (
    id: string | undefined,
    point: Point,
    transportMode?: string | null,
  ) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedMapStopAreaIdAction(id));
      dispatch(setMapStopAreaViewStateAction(MapEntityEditorViewState.POPUP));
      ensureVehicleModeVisible(transportMode);

      navigateToMap({
        viewPort: {
          latitude: point.latitude,
          longitude: point.longitude,
          zoom: 18,
        },
        filters: {
          observationDate,
        },
      });
    });
  };
}
