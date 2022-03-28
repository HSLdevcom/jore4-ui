import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../context/MapEditor';
import { FormState, schema } from '../forms/RoutePropertiesForm';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const {
    state: { editedRouteData, drawingMode, creatingNewRoute },
    dispatch,
  } = useContext(MapEditorContext);

  if (editedRouteData.id === undefined && !creatingNewRoute) {
    return null;
  }

  const routeDetails = editedRouteData.metaData;
  // checking whether 'routeDetails' already contains all the information necessary
  // if not -> should show the form
  const areFormValuesValid = schema.safeParse(routeDetails).success;
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
        editedRouteData: {
          metaData: data,
          stops: [],
        },
      },
    });
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
