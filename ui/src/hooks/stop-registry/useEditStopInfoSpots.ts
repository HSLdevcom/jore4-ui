import { useTranslation } from 'react-i18next';
import {
  InfoSpotState,
  InfoSpotsFormState,
} from '../../components/stop-registry/stops/stop-details/info-spots/schema';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import {
  getRequiredStopPlaceMutationProperties,
  showDangerToast,
} from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: InfoSpotsFormState;
  stop: StopWithDetails;
}

const mapInfoSpotFormToInput = (infoSpot: InfoSpotState) => {
  return {
    infoSpotId: infoSpot.infoSpotId,
    backlight: infoSpot.backlight,
    description: {
      lang: infoSpot.description?.lang,
      value: infoSpot.description?.value,
    },
    displayType: infoSpot.displayType
      ? (infoSpot.displayType as StopRegistryDisplayType)
      : null,
    floor: infoSpot.floor,
    label: infoSpot.label,
    posterPlaceSize: infoSpot.posterPlaceSize,
    // infoSpotLocations: infoSpot.infoSpotLocations,
    infoSpotType: infoSpot.infoSpotType
      ? (infoSpot.infoSpotType as StopRegistryInfoSpotType)
      : null,
    purpose: infoSpot.purpose,
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    zoneLabel: infoSpot.zoneLabel,
    maintenance: infoSpot.maintenance,
    poster:
      infoSpot.poster?.map((p) => ({
        label: p?.label,
        posterSize: p?.posterSize,
        lines: p?.lines,
      })) ?? [],
  };
};

export const useEditStopInfoSpots = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;

    const infoSpotsInput = state.infoSpots
      .filter((s) => !s.toBeDeleted)
      .map(mapInfoSpotFormToInput);

    const input = {
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      id: stopPlaceId,
      infoSpots: infoSpotsInput.length ? infoSpotsInput : null,
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

  const saveStopPlaceInfoSpots = async ({
    state,
    stop,
  }: {
    state: InfoSpotsFormState;
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
    saveStopPlaceInfoSpots,
    defaultErrorHandler,
  };
};
