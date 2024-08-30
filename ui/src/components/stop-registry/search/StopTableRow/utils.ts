import {
  StopSearchRow,
  useAppDispatch,
  useFilterStops,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../../hooks';
import {
  FilterType,
  resetMapState,
  setSelectedStopIdAction,
} from '../../../../redux';
import { mapLngLatToPoint } from '../../../../utils';

export function useOpenStopOnMap() {
  const dispatch = useAppDispatch();
  const { observationDate } = useObservationDateQueryParam();
  const { openMapWithParameters } = useMapQueryParams();
  const { toggleFunction } = useFilterStops();
  const toggleShowAllStops = toggleFunction(FilterType.ShowAllBusStops);

  return (stop: StopSearchRow) => {
    dispatch(resetMapState()).then(() => {
      dispatch(
        setSelectedStopIdAction(stop.scheduled_stop_point_id ?? undefined),
      );
      toggleShowAllStops(true);

      const point = mapLngLatToPoint(stop.measured_location.coordinates);
      openMapWithParameters({
        viewPortParams: {
          latitude: point.latitude,
          longitude: point.longitude,
          zoom: 15,
        },
        observationDate,
        displayedRouteParams: {},
      });
    });
  };
}
