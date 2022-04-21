import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  finishRouteMetadataEditingAction,
  Mode,
  selectMapEditor,
  stopDrawRouteAction,
} from '../../../redux';
import {
  routeFormSchema,
  RouteFormState,
} from '../../forms/route/RoutePropertiesForm.types';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editedRouteData, drawingMode, creatingNewRoute } =
    useAppSelector(selectMapEditor);

  const routeDetails = editedRouteData.metaData;
  // checking whether 'routeDetails' already contains all the information necessary
  // if not -> should show the form
  const areFormValuesValid = routeFormSchema.safeParse(routeDetails).success;
  const showCreateForm = !areFormValuesValid && drawingMode === Mode.Draw;

  const onClose = () => {
    dispatch(stopDrawRouteAction());
  };

  const onSuccess = (data: RouteFormState) => {
    dispatch(finishRouteMetadataEditingAction(data));
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
