import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../../hooks';
import {
  FilterType,
  resetMapState,
  setSelectedStopIdAction,
  setStopFilterAction,
} from '../../../../redux';
import { mapLngLatToPoint } from '../../../../utils';
import { StopSearchRow } from '../types';

export function useOpenStopOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const { openMapWithParameters } = useMapQueryParams();

  return (stop: StopSearchRow) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedStopIdAction(stop.quay.netexId ?? undefined));
      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowAllBusStops,
          isActive: true,
        }),
      );

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
