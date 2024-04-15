import compact from 'lodash/compact';
import isNumber from 'lodash/isNumber';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import { LocationDetailsFormState } from '../../components/stop-registry/stops/stop-details/location-details/schema';
import {
  StopRegistryGeoJsonType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import { setMultipleKeyValues, showDangerToast } from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: LocationDetailsFormState;
  stop: StopWithDetails;
}

export const useEditStopLocationDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    // TODO: These maps and typanem omits can be avoided completely by using
    // newer version of apollo client and then adding removeTypenameFromVariables link
    // but that currently causes a random cache desync with timing settings dropdown
    // so lets just use these omits for now and replace them in an individual PR
    // where we upgrade apollo client to > 3.8
    const initialKeyValues =
      stop?.stop_place?.keyValues?.map((keyValue) =>
        omit(keyValue, '__typename'),
      ) || [];

    const combinedKeyValues = setMultipleKeyValues(
      initialKeyValues,
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
    );

    const stopPlaceId = stop.stop_place?.id;

    const input = {
      id: stopPlaceId,
      keyValues: combinedKeyValues,
      // Note: this can't be modified (at the moment at least), but currently this is the only place where it is synced to timetables DB.
      geometry: {
        coordinates: [[state.latitude, state.longitude]],
        type: StopRegistryGeoJsonType.Point,
      },
      // TODO: find out if there's a more robust way to do this.
      // Needs to be included because otherwise the mutation will clear this field.
      description:
        stop.stop_place?.description &&
        omit(stop.stop_place?.description, '__typename'),
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
