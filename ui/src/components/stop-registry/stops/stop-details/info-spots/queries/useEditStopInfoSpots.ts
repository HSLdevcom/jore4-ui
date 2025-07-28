import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GetStopDetailsDocument,
  StopRegistryInfoSpotInput,
  StopRegistryPosterInput,
  useUpdateInfoSpotMutation,
} from '../../../../../../generated/graphql';
import { NullOptionEnum, showDangerToast } from '../../../../../../utils';
import { InfoSpotState, InfoSpotsFormState } from '../types';

const GQL_UPDATE_INFO_SPOTS = gql`
  mutation UpdateInfoSpot($input: [stop_registry_infoSpotInput]!) {
    stop_registry {
      mutateInfoSpots(infoSpot: $input) {
        ...info_spot_details
      }
    }
  }
`;

function mapNullEnumOption<T>(
  value: T | NullOptionEnum | null | undefined,
): T | null {
  if (value === null || value === undefined || value === NullOptionEnum.Null) {
    return null;
  }

  return value;
}

function mapPosterInput(
  poster: InfoSpotState['poster'],
): Array<StopRegistryPosterInput> | null {
  if (!poster?.length) {
    return null;
  }

  return poster.map(({ label, size, lines }) => ({
    label,
    width: size.width,
    height: size.height,
    lines,
  })) as Array<StopRegistryPosterInput>;
}

function mapInfoSpotFormToInput(
  infoSpot: InfoSpotState,
): StopRegistryInfoSpotInput {
  return {
    id: infoSpot.infoSpotId,
    backlight: infoSpot.backlight,
    description: {
      lang: infoSpot.description?.lang,
      value: infoSpot.description?.value,
    },
    displayType: mapNullEnumOption(infoSpot.displayType),
    floor: infoSpot.floor,
    label: infoSpot.label,
    width: infoSpot.size.width,
    height: infoSpot.size.height,
    infoSpotLocations: infoSpot.infoSpotLocations,
    infoSpotType: mapNullEnumOption(infoSpot.infoSpotType),
    purpose: infoSpot.purpose,
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    zoneLabel: infoSpot.zoneLabel,
    poster: mapPosterInput(infoSpot.poster),
  };
}

function handleDeletions(
  infoSpots: ReadonlyArray<InfoSpotState>,
): ReadonlyArray<InfoSpotState> {
  return infoSpots.map((spot) => ({
    ...spot,
    poster: spot.poster?.filter((poster) => !poster.toBeDeletedPoster) ?? [],
    infoSpotLocations: spot.toBeDeleted ? [] : spot.infoSpotLocations,
  }));
}

export const useEditStopInfoSpots = () => {
  const { t } = useTranslation();
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation({
    refetchQueries: [GetStopDetailsDocument],
  });

  const saveStopPlaceInfoSpots = async (params: {
    state: InfoSpotsFormState;
  }) => {
    await updateInfoSpotMutation({
      variables: {
        input: handleDeletions(params.state.infoSpots).map(
          mapInfoSpotFormToInput,
        ),
      },
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
