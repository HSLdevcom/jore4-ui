import { DateTime } from 'luxon';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditor';
import { MapFilterContext, setObservationDate } from '../context/MapFilter';
import { Maybe } from '../generated/graphql';
import { setIsModalMapOpenAction } from '../redux';
import { isDateInRange } from '../time';
import { useAppDispatch } from './redux';

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);
  const { dispatch: mapFilterDispatch } = useContext(MapFilterContext);

  const showRoutesOnModalById = (routeIds: UUID[]) => {
    mapEditorDispatch({ type: 'reset' });
    mapEditorDispatch({
      type: 'setState',
      payload: {
        initiallyDisplayedRouteIds: routeIds,
      },
    });
    dispatch(setIsModalMapOpenAction(true));
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

    mapFilterDispatch(setObservationDate(newObservationDate));
    showRoutesOnModalById(routeIds);
  };

  return { showRoutesOnModal };
};
