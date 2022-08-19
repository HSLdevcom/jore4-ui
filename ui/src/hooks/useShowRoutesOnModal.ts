import { DateTime } from 'luxon';
import { Maybe } from '../generated/graphql';
import {
  initializeMapEditorWithRoutesAction,
  setMapObservationDateAction,
} from '../redux';
import { isDateInRange } from '../time';
import { useAppDispatch } from './redux';
import { useMapQueryParams } from './urlQuery';

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { openMapAndSetMapPosition } = useMapQueryParams();

  const showRoutesOnModal = (
    routeIds: UUID[],
    validityStart: DateTime,
    validityEnd?: Maybe<DateTime>,
    latitude?: number,
    longitude?: number,
  ) => {
    const newObservationDate = isDateInRange(
      DateTime.now(),
      validityStart,
      validityEnd,
    )
      ? DateTime.now()
      : validityStart;

    dispatch(setMapObservationDateAction(newObservationDate));
    dispatch(initializeMapEditorWithRoutesAction(routeIds));
    openMapAndSetMapPosition(latitude, longitude);
  };

  return { showRoutesOnModal };
};
