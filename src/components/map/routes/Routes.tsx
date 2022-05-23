import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  finishRouteMetadataEditingAction,
  selectMapEditor,
  setRouteMetadataFormOpenAction,
  stopDrawRouteAction,
} from '../../../redux';
import {
  routeFormSchema,
  RouteFormState,
} from '../../forms/route/RoutePropertiesForm.types';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editedRouteData, isRouteMetadataFormOpen } =
    useAppSelector(selectMapEditor);

  const routeDetails = editedRouteData.metaData;

  const onClose = () => {
    dispatch(setRouteMetadataFormOpenAction(false));

    const hasFormBeenSubmitted =
      routeFormSchema.safeParse(routeDetails).success;

    // Only clear route creation state is there the form has not been submitted
    if (!hasFormBeenSubmitted) {
      dispatch(stopDrawRouteAction());
    }
  };

  const onSuccess = (data: RouteFormState) => {
    const areFormValuesValid = routeFormSchema.safeParse(data).success;

    if (areFormValuesValid) {
      dispatch(finishRouteMetadataEditingAction(data));
    }
  };

  const defaultValues: Partial<RouteFormState> = routeDetails || {};

  if (!isRouteMetadataFormOpen) {
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
