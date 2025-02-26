import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../../hooks';
import {
  FilterType,
  resetMapState,
  setEditedStopDataAction,
  setSelectedStopIdAction,
  setStopFilterAction,
} from '../../../../redux';
import { mapLngLatToPoint } from '../../../../utils';
import { useGetStopPointForQuay } from '../../../hooks';
import { StopSearchRow } from '../types';

export function useOpenStopOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const { openMapWithParameters } = useMapQueryParams();
  const getStopPointForQuay = useGetStopPointForQuay();

  return (stop: StopSearchRow) => {
    Promise.all([
      stop.quay.netexId
        ? getStopPointForQuay(stop.quay.netexId)
        : Promise.resolve(null),
      dispatch(resetMapState()),
    ]).then(([stopPoint]) => {
      if (stopPoint?.stop_place_ref) {
        dispatch(setSelectedStopIdAction(stopPoint.stop_place_ref));
        dispatch(setEditedStopDataAction(stopPoint));
      }

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
