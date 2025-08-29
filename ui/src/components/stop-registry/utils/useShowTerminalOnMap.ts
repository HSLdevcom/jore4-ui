import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  FilterType,
  MapEntityEditorViewState,
  resetMapState,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
  setStopFilterAction,
} from '../../../redux';
import { Point } from '../../../types';

export function useShowTerminalOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const { openMapWithParameters } = useMapQueryParams();

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
