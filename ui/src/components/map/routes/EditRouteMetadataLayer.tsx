import React from 'react';
import { useGetLineDetailsByIdAsyncQuery } from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  finishRouteMetadataEditingAction,
  resetRouteCreatingAction,
  selectMapEditor,
  setLineInfoAction,
  setRouteMetadataFormOpenAction,
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
  const [getLineDetailsById] = useGetLineDetailsByIdAsyncQuery();
  const { editedRouteData, isRouteMetadataFormOpen } =
    useAppSelector(selectMapEditor);

  const onClose = () => {
    dispatch(setRouteMetadataFormOpenAction(false));

    const alreadyHaveValidFormValues = areFormValuesValid(
      editedRouteData.metaData,
    );

    // In case route metadata form has not yet been submitted with valid values,
    // closing the metadata form will also cancel the route creation.
    // Otherwise, clicking close on the modal will only close the modal
    if (!alreadyHaveValidFormValues) {
      dispatch(resetRouteCreatingAction());
    }
  };

  const onSuccess = async (formData: RouteFormState) => {
    // The line might have been changed by the user, so have to refresh its data in the redux store
    const results = await getLineDetailsById({ line_id: formData.onLineId });
    if (!results?.data?.route_line_by_pk) {
      throw new Error("Couldn't get line details!");
    }

    dispatch(setLineInfoAction(results.data.route_line_by_pk));
    dispatch(finishRouteMetadataEditingAction(formData));
  };

  // In can we already have some route metadata, fill it in. Also fill in the line id if we already
  // have it
  const defaultValues: Partial<RouteFormState> = {
    ...editedRouteData.metaData,
    onLineId: editedRouteData.lineInfo?.line_id,
  };

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
