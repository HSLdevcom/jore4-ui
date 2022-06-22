import { DateTime } from 'luxon';
import { Maybe } from '../generated/graphql';
import {
  initializeMapEditorWithRoutesAction,
  setIsModalMapOpenAction,
  setMapObservationDateAction,
} from '../redux';
import { isDateInRange } from '../time';
import { useAppDispatch } from './redux';
import { useMapUrlQuery } from './useMapUrlQuery';

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapUrlQuery();

  const showRoutesOnModalById = (routeIds: UUID[]) => {
    dispatch(initializeMapEditorWithRoutesAction(routeIds));

    dispatch(setIsModalMapOpenAction(true));
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
