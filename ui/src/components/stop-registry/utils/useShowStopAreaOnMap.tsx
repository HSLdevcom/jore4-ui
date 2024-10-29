import {
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  FilterType,
  resetMapState,
  setSelectedMapStopAreaIdAction,
  setStopFilterAction,
} from '../../../redux';
import { Point } from '../../../types';

export function useShowStopAreaOnMap() {
  const dispatch = useAppDispatch();
  const { observationDate } = useObservationDateQueryParam();
  const { openMapWithParameters } = useMapQueryParams();

  return (id: string | undefined, point: Point) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedMapStopAreaIdAction(id));
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
