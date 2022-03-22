import { DateTime } from 'luxon';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditorContext';
import { MapFilterContext, setObservationDate } from '../context/MapFilter';
import { ModalMapContext } from '../context/ModalMapContext';
import { isDateInRange } from '../time';

export const useShowRoutesOnModal = () => {
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
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

    modalMapDispatch({ type: 'open' });
  };

  const showRoutesOnModal = (
    routeIds: UUID[],
    validityStart: DateTime,
    validityEnd?: DateTime,
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
