import isString from 'lodash/isString';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import { SignageDetailsFormState } from '../../components/stop-registry/stops/stop-details/signage-details/schema';
import { useUpdateStopPlaceMutation } from '../../generated/graphql';
import {
  getRequiredStopPlaceMutationProperties,
  showDangerToast,
} from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: SignageDetailsFormState;
  stop: StopWithDetails;
}

export const useEditStopSignageDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;

    const initialPlaceEquipments = stop.quay?.placeEquipments ?? {};
    const initialGeneralSign = initialPlaceEquipments?.generalSign?.[0] ?? {};

    const input = {
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      id: stopPlaceId,
      placeEquipments: {
        ...omit(initialPlaceEquipments, '__typename'),
        // Note, assuming here that there is always 0-1 general signs
        // (if more, they would be deleted?).
        generalSign: [
          {
            ...omit(initialGeneralSign, '__typename'),
            privateCode: state.signType && {
              type: 'HSL',
              value: state.signType,
            },
            numberOfFrames: state.numberOfFrames,
            lineSignage: state.lineSignage,
            replacesRailSign: state.replacesRailSign,
            mainLineSign: state.mainLineSign,
            note: isString(state.signageInstructionExceptions)
              ? {
                  lang: 'fin',
                  value: state.signageInstructionExceptions,
                }
              : undefined,
          },
        ],
      },
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

  const saveStopPlaceSignageDetails = async ({
    state,
    stop,
  }: {
    state: SignageDetailsFormState;
    stop: StopWithDetails;
  }) => {
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
    saveStopPlaceSignageDetails,
    defaultErrorHandler,
  };
};
