import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';

export const useShowRoutesOnModal = () => {
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);

  const showRoutesOnModal = (routeIds: UUID[]) => {
    mapEditorDispatch({ type: 'reset' });
    mapEditorDispatch({
      type: 'setState',
      payload: {
        displayedRouteIds: routeIds,
      },
    });
    modalMapDispatch({ type: 'open' });
  };

  return { showRoutesOnModal };
};
