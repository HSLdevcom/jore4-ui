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
  const { addMapOpenQueryParameter } = useMapQueryParams();

  const showRoutesOnModalById = (routeIds: UUID[]) => {
    dispatch(initializeMapEditorWithRoutesAction(routeIds));

    addMapOpenQueryParameter();
  };

  const showRoutesOnModal = (
    routeIds: UUID[],
    validityStart: DateTime,
    validityEnd?: Maybe<DateTime>,
  ) => {
    const newObservationDate = isDateInRange(
      DateTime.now(),
      validityStart,
      validityEnd,
    )
      ? DateTime.now()
      : validityStart;

    dispatch(setMapObservationDateAction(newObservationDate));
    showRoutesOnModalById(routeIds);
  };

  return { showRoutesOnModal };
};
