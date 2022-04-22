import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../../context/MapEditor';
import {
  routeFormSchema,
  RouteFormState,
} from '../../forms/route/RoutePropertiesForm.types';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const {
    state: { editedRouteData, drawingMode, creatingNewRoute },
    dispatch,
  } = useContext(MapEditorContext);

  const routeDetails = editedRouteData.metaData;
  // checking whether 'routeDetails' already contains all the information necessary
  // if not -> should show the form
  const areFormValuesValid = routeFormSchema.safeParse(routeDetails).success;
  const showCreateForm = !areFormValuesValid && drawingMode === Mode.Draw;

  const onClose = () => {
    dispatch({ type: 'stopDrawRoute' });
  };

  const onSuccess = (data: RouteFormState) => {
    dispatch({
      type: 'setState',
      payload: {
        editedRouteData: {
          metaData: data,
          stops: [],
          templateRouteId: editedRouteData.templateRouteId,
        },
        drawingMode: editedRouteData.templateRouteId ? Mode.Edit : Mode.Draw,
      },
    });
  };

  const defaultValues: Partial<RouteFormState> = routeDetails || {};

  if ((!editedRouteData.id && !creatingNewRoute) || !showCreateForm) {
    return null;
  }

  return (
    <CreateRouteModal
      defaultValues={defaultValues}
      onSuccess={onSuccess}
      onCancel={onClose}
      onClose={onClose}
    />
  );
};
