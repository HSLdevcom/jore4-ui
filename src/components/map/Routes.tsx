import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { FormState, schema } from '../forms/RoutePropertiesForm';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const {
    state: { routeDetails, drawingMode, editingRouteId },
    dispatch,
  } = useContext(MapEditorContext);

  if (editingRouteId === undefined) {
    return null;
  }

  // checking whether 'routeDetails' already contains all the information necessary
  // if not -> should show the form
  const areFormValuesValid = schema.safeParse(
    routeDetails?.get(editingRouteId),
  ).success;
  const showCreateForm = !areFormValuesValid && drawingMode === Mode.Draw;

  const onCancel = () => {
    dispatch({ type: 'stopDrawRoute' });
  };
  const onClose = () => {
    dispatch({ type: 'stopDrawRoute' });
  };

  const onSuccess = (data: FormState) => {
    dispatch({
      type: 'setState',
      payload: {
        routeDetails: new Map(routeDetails).set(editingRouteId, data),
      },
    });
  };

  const defaultValues: Partial<FormState> =
    routeDetails?.get(editingRouteId) || {};

  return (
    <>
      {showCreateForm && (
        <CreateRouteModal
          defaultValues={defaultValues}
          onSuccess={onSuccess}
          onCancel={onCancel}
          onClose={onClose}
        />
      )}
    </>
  );
};
