import { DateTime } from 'luxon';
import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  FilterType,
  MapEntityEditorViewState,
  resetMapState,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
  setStopFilterAction,
} from '../../../redux';
import { LocatableStop } from '../types';

export function useShowStopOnMap() {
  const dispatch = useAppDispatch();

  // Get existing observationDate or default, but don't touch the URL
  const { observationDate: currentObservationDate } =
    useObservationDateQueryParam({
      initialize: false,
    });
  const { openMapWithParameters } = useMapQueryParams();

  return (
    { netextId, location }: LocatableStop,
    observeOnDate: DateTime | null = null,
  ) => {
    dispatch(resetMapState()).then(() => {
      if (netextId) {
        dispatch(setSelectedStopIdAction(netextId));
        dispatch(setMapStopViewStateAction(MapEntityEditorViewState.POPUP));
      }

      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowAllBusStops,
          isActive: true,
        }),
      );

      openMapWithParameters({
        viewPortParams: {
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 15,
        },
        observationDate: observeOnDate ?? currentObservationDate,
        displayedRouteParams: {},
      });
    });
  };
}
