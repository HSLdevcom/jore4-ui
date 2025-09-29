import { useAppDispatch, useObservationDateQueryParam } from '../../../hooks';
import {
  FilterType,
  MapEntityEditorViewState,
  resetMapState,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
  setStopFilterAction,
} from '../../../redux';
import { Point } from '../../../types';
import { useNavigateToMap } from '../../map/utils/useNavigateToMap';

export function useShowTerminalOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const navigateToMap = useNavigateToMap();

  return (id: string | undefined, point: Point) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedTerminalIdAction(id));
      dispatch(setMapTerminalViewStateAction(MapEntityEditorViewState.POPUP));
      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowAllBusStops,
          isActive: true,
        }),
      );

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
