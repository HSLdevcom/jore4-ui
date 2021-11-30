import React, { useReducer, useRef } from 'react';
import { MapEditorContext } from '../../context/MapEditorContext';
import { initialState, mapEditorReducer } from '../../context/MapEditorReducer';
import {
  InsertRouteOneMutationVariables,
  useInsertRouteOneMutation,
} from '../../generated/graphql';
import { Modal } from '../../uiComponents';
import { mapToObject, mapToVariables } from '../../utils';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const ModalMap: React.FC<Props> = ({ isOpen, onClose, className }) => {
  const mapRef = useRef<ExplicitAny>(null);

  const [insertRouteMutation] = useInsertRouteOneMutation();
  const [state, dispatch] = useReducer(mapEditorReducer, initialState);

  const onAddStop = () => dispatch({ type: 'toggleAddStop' });
  const onDrawRoute = () => dispatch({ type: 'toggleDrawRoute' });
  const onEditRoute = () => dispatch({ type: 'toggleEditRoute' });
  const onCancel = () => {
    mapRef?.current?.onDeleteDrawnRoute();
    dispatch({ type: 'reset' });
  };
  const onSave = async () => {
    const { busRoute, stopsWithinRoute } = state;

    if (busRoute && stopsWithinRoute && stopsWithinRoute.length >= 2) {
      // TODO: user should be able to select starting stop and final stop from some kind of UI.
      // TODO: for now, just use two random stops within route as starting stop
      // and final stop.
      const startingStop = stopsWithinRoute[0].scheduled_stop_point_id;
      const finalStop = stopsWithinRoute[1].scheduled_stop_point_id;

      const variables: InsertRouteOneMutationVariables = mapToObject({
        starts_from_scheduled_stop_point_id: startingStop,
        ends_at_scheduled_stop_point_id: finalStop,
        on_line_id: state.routeDetails?.on_line_id,
        // TODO: route_shape does not end up in hasura (!!!), so probably
        // we should send something else than "geometry" there (?)
        route_shape: busRoute.routes[0]?.geometry,
        priority: 10,
      });
      try {
        await insertRouteMutation(mapToVariables(variables));
        // eslint-disable-next-line no-console
        console.log('Route saved succesfully. TODO: inform user about it');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(
          `Error when creating route, ${err}, TODO: show error message}`,
        );
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Something went wrong, cannot save route.');
    }
  };
  const onDeleteRoute = () => {
    dispatch({ type: 'setState', payload: { drawingMode: undefined } });
    mapRef?.current?.onDeleteDrawnRoute();
  };
  const onCloseModalMap = () => {
    dispatch({ type: 'reset' });
    onClose();
  };

  const { canAddStops } = state;

  return (
    <MapEditorContext.Provider value={{ state, dispatch }}>
      <Modal isOpen={isOpen} onClose={onCloseModalMap} className={className}>
        <MapHeader onClose={onCloseModalMap} />
        {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
        <Map
          height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
          canAddStops={canAddStops}
          drawable
          ref={mapRef}
        />
        <MapFooter
          onDrawRoute={onDrawRoute}
          onEditRoute={onEditRoute}
          onDeleteRoute={onDeleteRoute}
          onCancel={onCancel}
          onSave={onSave}
          canAddStops={canAddStops}
          onAddStop={onAddStop}
        />
      </Modal>
    </MapEditorContext.Provider>
  );
};
