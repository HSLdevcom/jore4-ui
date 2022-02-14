import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { FormState, schema } from '../forms/RoutePropertiesForm';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const {
    state: { routeDetails, drawingMode },
    dispatch,
  } = useContext(MapEditorContext);

  // checking whether 'routeDetails' already contains all the information necessary
  // if not -> should show the form
  const areFormValuesValid = schema.safeParse(routeDetails).success;
  const showCreateForm = !areFormValuesValid && drawingMode === Mode.Draw;

  const onCancel = () => {
    dispatch({ type: 'reset' });
  };
  const onClose = () => {
    dispatch({ type: 'reset' });
  };

  const onSuccess = (data: FormState) => {
    dispatch({ type: 'setState', payload: { routeDetails: data } });
  };

  const defaultValues: Partial<FormState> = routeDetails || {};

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
