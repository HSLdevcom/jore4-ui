import compact from 'lodash/compact';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { LocationDetailsFormState } from '../../components/stop-registry/stops/stop-details/location-details/schema';
import { useUpdateStopPlaceMutation } from '../../generated/graphql';
import { StopWithDetails } from '../../types';
import {
  mapPointToStopRegistryGeoJSON,
  patchKeyValues,
  showDangerToast,
} from '../../utils';
import { getQuayIdsFromStopExcept } from './useGetStopDetails';

type EditTiamatParams = {
  readonly state: LocationDetailsFormState;
  readonly stop: StopWithDetails;
};

export const useEditStopLocationDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceQuayId = stop.stop_place_ref;
    const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

    const input = {
      id: stop.stop_place?.id,
      quays: [
        ...otherQuays,
        {
          id: stopPlaceQuayId,
          // Note: this can't be modified (at the moment at least), but currently this is the only place where it is synced to timetables DB.
          geometry: mapPointToStopRegistryGeoJSON(state),
          keyValues: patchKeyValues(
            stop.quay,
            compact([
              state.streetAddress && {
                key: 'streetAddress',
                values: [state.streetAddress.toString()],
              },
              state.postalCode && {
                key: 'postalCode',
                values: [state.postalCode.toString()],
              },
              isNumber(state.functionalArea) && {
                key: 'functionalArea',
                values: [state.functionalArea.toString()],
              },
            ]),
          ),
        },
      ],
    };

    return input;
  };

  const prepareEditForTiamatDb = ({ state, stop }: EditTiamatParams) => {
    return {
      input: mapStopEditChangesToTiamatDbInput({
        state,
        stop,
      }),
    };
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveStopPlaceLocationDetails = async ({
    state,
    stop,
  }: {
    state: LocationDetailsFormState;
    stop: StopWithDetails;
  }) => {
    // TODO: edit location in routes and lines DB.

    await updateTiamatStopPlace({
      state,
      stop,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  return {
    saveStopPlaceLocationDetails,
    defaultErrorHandler,
  };
};
