import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  FilterType,
  MapEntityEditorViewState,
  resetMapState,
  setMapStopAreaViewStateAction,
  setSelectedMapStopAreaIdAction,
  setStopFilterAction,
} from '../../../redux';
import { Point } from '../../../types';

export function useShowStopAreaOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const { openMapWithParameters } = useMapQueryParams();

  return (id: string | undefined, point: Point) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedMapStopAreaIdAction(id));
      dispatch(setMapStopAreaViewStateAction(MapEntityEditorViewState.POPUP));
      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowAllBusStops,
          isActive: false,
        }),
      );

      openMapWithParameters({
        viewPortParams: {
          latitude: point.latitude,
          longitude: point.longitude,
          zoom: 18,
        },
        observationDate,
        displayedRouteParams: {},
      });
    });
  };
}
