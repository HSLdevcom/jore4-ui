import { DateTime } from 'luxon';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditor';
import { MapFilterContext, setObservationDate } from '../context/MapFilter';
import { ModalMapContext } from '../context/ModalMapContext';
import { Maybe } from '../generated/graphql';
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
