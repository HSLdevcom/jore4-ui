import { DateTime } from 'luxon';
import { useAppDispatch, useObservationDateQueryParam } from '../../../hooks';
import {
  FilterType,
  MapEntityEditorViewState,
  resetMapState,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
  setStopFilterAction,
} from '../../../redux';
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

  return (
    { netexId, location }: LocatableStop,
    observeOnDate: DateTime | null = null,
  ) => {
    dispatch(resetMapState()).then(() => {
      if (netexId) {
        dispatch(setSelectedStopIdAction(netexId));
        dispatch(setMapStopViewStateAction(MapEntityEditorViewState.POPUP));
      }

      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowAllBusStops,
          isActive: true,
        }),
      );

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
