import isString from 'lodash/isString';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import { SignageDetailsFormState } from '../../components/stop-registry/stops/stop-details/signage-details/schema';
import { useUpdateStopPlaceMutation } from '../../generated/graphql';
import { StopWithDetails } from '../../types';
import { showDangerToast } from '../../utils';
import { getQuayIdsFromStopExcept } from './useGetStopDetails';

type EditTiamatParams = {
  readonly state: SignageDetailsFormState;
  readonly stop: StopWithDetails;
};

export const useEditStopSignageDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;
    const stopPlaceQuayId = stop.stop_place_ref;

    const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

    const initialGeneralSign =
      stop.quay?.placeEquipments?.generalSign?.[0] ?? {};

    return {
      id: stopPlaceId,
      quays: [
        ...otherQuays,
        {
          id: stopPlaceQuayId,
          placeEquipments: {
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
