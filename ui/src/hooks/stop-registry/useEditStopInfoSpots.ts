import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  InfoSpotState,
  InfoSpotsFormState,
} from '../../components/stop-registry/stops/stop-details/info-spots/info-spots-form/schema';
import {
  GetStopDetailsDocument,
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
  StopRegistryPosterInput,
  StopRegistryPosterPlaceSize,
  useUpdateInfoSpotMutation,
} from '../../generated/graphql';
import { showDangerToast } from '../../utils';

type EditTiamatParams = {
  readonly state: InfoSpotsFormState;
};

const GQL_UPDATE_INFO_SPOTS = gql`
  mutation UpdateInfoSpot($input: [stop_registry_infoSpotInput]!) {
    stop_registry {
      mutateInfoSpots(infoSpot: $input) {
        ...info_spot_details
      }
    }
  }
`;

const mapPosterInput = (
  poster: InfoSpotState['poster'],
): Array<StopRegistryPosterInput> | null => {
  if (!poster?.length) {
    return null;
  }

  return poster.map(({ label, posterSize, lines }) => ({
    label,
    posterSize,
    lines,
  })) as Array<StopRegistryPosterInput>;
};

const mapInfoSpotFormToInput = (infoSpot: InfoSpotState) => {
  return {
    id: infoSpot.infoSpotId,
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
    posterPlaceSize: infoSpot.posterPlaceSize
      ? (infoSpot.posterPlaceSize as StopRegistryPosterPlaceSize)
      : null,
    infoSpotLocations: infoSpot.infoSpotLocations,
    infoSpotType: infoSpot.infoSpotType
      ? (infoSpot.infoSpotType as StopRegistryInfoSpotType)
      : null,
    purpose: infoSpot.purpose,
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    zoneLabel: infoSpot.zoneLabel,
    poster: mapPosterInput(infoSpot.poster),
  };
};

const mapStopEditChangesToTiamatDbInput = ({ state }: EditTiamatParams) => {
  const infoSpotsInput = state.infoSpots.map(mapInfoSpotFormToInput);

  return infoSpotsInput;
};

const prepareEditForTiamatDb = ({ state }: EditTiamatParams) => {
  return {
    input: mapStopEditChangesToTiamatDbInput({
      state,
    }),
  };
};

export const useEditStopInfoSpots = () => {
  const { t } = useTranslation();
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation({
    refetchQueries: [GetStopDetailsDocument],
  });

  const clearLocationsForDeletedInfoSpots = (
    infoSpots: ReadonlyArray<InfoSpotState>,
  ) => {
    const hasDeletedSpots = infoSpots.some((spot) => spot.toBeDeleted);

    if (hasDeletedSpots) {
      return infoSpots.map((spot) => ({
        ...spot,
        infoSpotLocations: spot.toBeDeleted ? [] : spot.infoSpotLocations,
      }));
    }

    return infoSpots;
  };

  const clearDeletedPosters = (infoSpots: ReadonlyArray<InfoSpotState>) => {
    return infoSpots.map((spot) => ({
      ...spot,
      poster: spot.poster?.filter((poster) => !poster.toBeDeletedPoster) ?? [],
    }));
  };

  const saveStopPlaceInfoSpots = async (params: {
    state: InfoSpotsFormState;
  }) => {
    const updatedParams = {
      state: {
        ...params.state,
        infoSpots: clearDeletedPosters(
          clearLocationsForDeletedInfoSpots(params.state.infoSpots),
        ),
      },
    };

    const changesToTiamatDb = prepareEditForTiamatDb(updatedParams);
    await updateInfoSpotMutation({
      variables: changesToTiamatDb,
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
