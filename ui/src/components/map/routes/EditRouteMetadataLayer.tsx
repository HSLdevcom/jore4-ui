import React from 'react';
import { pipe } from 'remeda';
import {
  useGetLineDetailsByIdAsyncQuery,
  useGetRouteDetailsByIdAsyncQuery,
} from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  finishRouteMetadataEditingAction,
  resetRouteCreatingAction,
  selectMapEditor,
  setDraftRouteJourneyPatternStopsAction,
  setLineInfoAction,
  setRouteMetadataFormOpenAction,
} from '../../../redux';
import { mapStopInJourneyPatternToJourneyPatternStop } from '../../../utils';
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
  const [getRouteDetailsById] = useGetRouteDetailsByIdAsyncQuery();
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

    const { templateRouteId } = editedRouteData;

    /**
     * Get journey pattern stop metadata (e.g. via info) from template route
     */
    if (templateRouteId) {
      const routeDetailsResult = await getRouteDetailsById({
        routeId: templateRouteId,
      });
      if (!routeDetailsResult.data.route_route_by_pk)
        throw new Error("Can't find route and line details");

      const newJourneyPatternStops = pipe(
        routeDetailsResult.data.route_route_by_pk.route_journey_patterns[0]
          .scheduled_stop_point_in_journey_patterns,
        (stops) => stops.map(mapStopInJourneyPatternToJourneyPatternStop),
      );

      dispatch(setDraftRouteJourneyPatternStopsAction(newJourneyPatternStops));
    }
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
