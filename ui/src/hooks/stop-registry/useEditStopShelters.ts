import { useTranslation } from 'react-i18next';
import {
  ShelterState,
  SheltersFormState,
} from '../../components/stop-registry/stops/stop-details/shelters/schema';
import {
  StopRegistryCycleStorageType,
  StopRegistryQuayInput,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
  StopRegistryStopPlaceInput,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import { showDangerToast } from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: SheltersFormState;
  stop: StopWithDetails;
}

const enclosedShelterTypes = [
  StopRegistryShelterType.Glass,
  StopRegistryShelterType.Steel,
];

const mapShelterFormToInput = (shelter: ShelterState) => {
  const enclosed = !!(
    shelter.shelterType && shelter.shelterType in enclosedShelterTypes
  );

  return {
    id: shelter.shelterNetexId,
    enclosed,
    // Leaving stepFree unset because it looks like it isn't used for anything important in Tiamat.
    // Could maybe deduce from accessibility properties, but that would mean we would need to
    // update shelters whenever those change = added complexity = not worth.
    stepFree: null,
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

function mapStopEditChangesToTiamatDbInput({
  state,
  stop,
}: EditTiamatParams): StopRegistryStopPlaceInput {
  const stopPlaceId = stop.stop_place?.id;
  const stopPlaceQuayId = stop.stop_place_ref;
  const existingQuays =
    stop.stop_place?.quays
      ?.filter((quay) => quay?.id !== stopPlaceQuayId)
      .map((quay) => quay as StopRegistryQuayInput) ?? [];

  const sheltersInput = state.shelters
    .filter((s) => !s.toBeDeleted)
    .map(mapShelterFormToInput);
  const hasBicycleParking = sheltersInput.some((s) => s.bicycleParking);

  return {
    id: stopPlaceId,
    quays: [
      ...existingQuays,
      {
        id: stopPlaceQuayId,
        placeEquipments: {
          shelterEquipment: sheltersInput.length ? sheltersInput : [null],
          cycleStorageEquipment: hasBicycleParking
            ? [
                {
                  // Use "Other" since we don't know the specific type
                  cycleStorageType: StopRegistryCycleStorageType.Other,
                },
              ]
            : [null],
        },
      },
    ],
  };
}

function prepareEditForTiamatDb({ state, stop }: EditTiamatParams) {
  return {
    input: mapStopEditChangesToTiamatDbInput({
      state,
      stop,
    }),
  };
}

export const useEditStopShelters = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;
    const stopPlaceQuayId = stop.stop_place_ref;
    const existingQuays =
      stop.stop_place?.quays
        ?.filter((quay) => quay?.id !== stopPlaceQuayId)
        .map((quay) => quay as StopRegistryQuayInput) ?? [];

    const sheltersInput = state.shelters
      .filter((s) => !s.toBeDeleted)
      .map(mapShelterFormToInput);
    const hasBicycleParking = sheltersInput.some((s) => s.bicycleParking);

    const input = {
      id: stopPlaceId,
      quays: [
        ...existingQuays,
        {
          id: stopPlaceQuayId,
          placeEquipments: {
            shelterEquipment: sheltersInput.length ? sheltersInput : null,
            cycleStorageEquipment: hasBicycleParking
              ? [
                  {
                    // Use "Other" since we don't know the specific type
                    cycleStorageType: StopRegistryCycleStorageType.Other,
                  },
                ]
              : null,
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
