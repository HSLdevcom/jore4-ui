import { useTranslation } from 'react-i18next';
import {
  ShelterFormRowState,
  SheltersFormState,
} from '../../components/stop-registry/stops/stop-details/shelters/schema';
import {
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import {
  getRequiredStopPlaceMutationProperties,
  showDangerToast,
} from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: SheltersFormState;
  stop: StopWithDetails;
}

const mapShelterFormToInput = (shelter: ShelterFormRowState) => {
  return {
    // TODO: what values should be used for these? They don't exist in UI.
    // enclosed: shelter.enclosed,
    // stepFree: shelter.stepFree,
    shelterType: shelter.shelterType
      ? (shelter.shelterType as StopRegistryShelterType)
      : null,
    shelterElectricity: shelter.shelterElectricity
      ? (shelter.shelterElectricity as StopRegistryShelterElectricity)
      : null,
    shelterLighting: shelter.shelterLighting,
    shelterCondition: shelter.shelterCondition
      ? (shelter.shelterCondition as StopRegistryShelterCondition)
      : null,
    timetableCabinets: shelter.timetableCabinets,
    trashCan: shelter.trashCan,
    shelterHasDisplay: shelter.shelterHasDisplay,
    bicycleParking: shelter.bicycleParking,
    leaningRail: shelter.leaningRail,
    outsideBench: shelter.outsideBench,
    shelterFasciaBoardTaping: shelter.shelterFasciaBoardTaping,
  };
};

export const useEditStopShelters = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;
    const quay = stop.stop_place?.quays?.[0];
    const stopPlaceQuayId = quay?.id;

    const sheltersInput = state.shelters.map(mapShelterFormToInput);

    const input = {
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      id: stopPlaceId,
      quays: [
        {
          id: stopPlaceQuayId,
          placeEquipments: {
            shelterEquipment: sheltersInput.length ? sheltersInput : null,
            // TODO: also set cycleStorageEquipment.cycleStorageType
          },
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

  const saveStopPlaceShelters = async ({
    state,
    stop,
  }: {
    state: SheltersFormState;
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
    saveStopPlaceShelters,
    defaultErrorHandler,
  };
};
