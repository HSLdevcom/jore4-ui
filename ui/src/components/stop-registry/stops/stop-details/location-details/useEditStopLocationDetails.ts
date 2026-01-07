import compact from 'lodash/compact';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import {
  StopRegistrySignContentType,
  StopRegistryStopPlaceInput,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import {
  KnownValueKey,
  mapPointToStopRegistryGeoJSON,
  patchKeyValues,
  showDangerToast,
} from '../../../../../utils';
import { mapPrivateCodeToInput, omitTypeName } from '../../../utils';
import { getQuayIdsFromStopExcept } from '../useGetStopDetails';
import { LocationDetailsFormState } from './schema';

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
  }: EditTiamatParams): StopRegistryStopPlaceInput => {
    const stopPlaceQuayId = stop.stop_place_ref;
    const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

    const initialGeneralSign =
      stop.quay?.placeEquipments?.generalSign?.[0] ?? {};

    return {
      id: stop.stop_place?.id,
      versionComment:
        state.reasonForChange !== '' ? state.reasonForChange : null,
      quays: [
        ...otherQuays,
        {
          id: stopPlaceQuayId,
          // Note: this can't be modified (at the moment at least), but currently this is the only place where it is synced to timetables DB.
          geometry: mapPointToStopRegistryGeoJSON(state),
          placeEquipments: {
            generalSign: [
              {
                numberOfFrames: initialGeneralSign.numberOfFrames,
                replacesRailSign: initialGeneralSign.replacesRailSign,
                privateCode: mapPrivateCodeToInput(
                  initialGeneralSign.privateCode,
                ),
                note: omitTypeName(initialGeneralSign.note),
                signContentType: state.signContentType
                  ? (state.signContentType as StopRegistrySignContentType)
                  : null,
                content: state.platformNumber
                  ? { value: state.platformNumber }
                  : null,
              },
            ],
          },
          keyValues: patchKeyValues(
            stop.quay,
            compact([
              state.streetAddress && {
                key: KnownValueKey.StreetAddress,
                values: [state.streetAddress.toString()],
              },
              state.postalCode && {
                key: KnownValueKey.PostalCode,
                values: [state.postalCode.toString()],
              },
              isNumber(state.functionalArea) && {
                key: KnownValueKey.FunctionalArea,
                values: [state.functionalArea.toString()],
              },
            ]),
          ),
        },
      ],
    };
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
