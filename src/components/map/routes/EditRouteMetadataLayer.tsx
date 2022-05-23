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
import { EditRouteModal } from './EditRouteModal';

const areFormValuesValid = (formData?: Partial<RouteFormState>) =>
  routeFormSchema.safeParse(formData).success;

export const EditRouteMetadataLayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editedRouteData, isRouteMetadataFormOpen } =
    useAppSelector(selectMapEditor);

  const routeDetails = editedRouteData.metaData;

  const onClose = () => {
    dispatch(setRouteMetadataFormOpenAction(false));

    const alreadyHaveValidFormValues = areFormValuesValid(routeDetails);

    // In case route metadata form has not yet been submitted with valid values,
    // closing the metadata form will also cancel the route creation.
    // Otherwise, clicking close on the modal will only close the modal
    if (!alreadyHaveValidFormValues) {
      dispatch(stopDrawRouteAction());
    }
  };

  const onSuccess = (data: RouteFormState) => {
    dispatch(finishRouteMetadataEditingAction(data));
  };

  const defaultValues: Partial<RouteFormState> = routeDetails || {};

  if (!isRouteMetadataFormOpen) {
    return null;
  }

  return (
    <EditRouteModal
      defaultValues={defaultValues}
      onSuccess={onSuccess}
      onCancel={onClose}
      onClose={onClose}
    />
  );
};
