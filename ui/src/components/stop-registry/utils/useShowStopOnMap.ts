import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  FilterType,
  resetMapState,
  setEditedStopDataAction,
  setSelectedStopIdAction,
  setStopFilterAction,
} from '../../../redux';
import { useGetStopPointForQuay } from '../../hooks';
import { LocatableStop } from '../types';

export function useShowStopOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });
  const { openMapWithParameters } = useMapQueryParams();
  const getStopPointForQuay = useGetStopPointForQuay();

  return (
    { netextId, location }: LocatableStop,
    observeOnStopValidityStartDate: boolean = false,
  ) => {
    Promise.all([
      netextId ? getStopPointForQuay(netextId) : Promise.resolve(null),
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

      const observeOn =
        (observeOnStopValidityStartDate
          ? stopPoint?.validity_start
          : observationDate) ?? observationDate;

      openMapWithParameters({
        viewPortParams: {
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 15,
        },
        observationDate: observeOn,
        displayedRouteParams: {},
      });
    });
  };
}
