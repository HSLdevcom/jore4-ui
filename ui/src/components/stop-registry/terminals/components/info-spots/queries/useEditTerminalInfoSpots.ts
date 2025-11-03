import { useTranslation } from 'react-i18next';
import {
  GetParentStopPlaceDetailsDocument,
  StopRegistryInfoSpotInput,
  StopRegistryPosterInput,
  useUpdateInfoSpotMutation,
} from '../../../../../../generated/graphql';
import {
  NullOptionEnum,
  mapPointToStopRegistryGeoJSON,
  showDangerToastWithError,
} from '../../../../../../utils';
import { mapPurposeToString } from '../../../../stops/stop-details/info-spots/utils';
import { TerminalInfoSpotFormState } from '../types';

function mapNullEnumOption<T>(
  value: T | NullOptionEnum | null | undefined,
): T | null {
  if (value === null || value === undefined || value === NullOptionEnum.Null) {
    return null;
  }

  return value;
}

function mapPosterInput(
  poster: TerminalInfoSpotFormState['poster'],
): Array<StopRegistryPosterInput> | null {
  if (!poster?.length) {
    return null;
  }

  return poster.map(
    ({ label, size, lines }): StopRegistryPosterInput => ({
      label,
      width: size.width,
      height: size.height,
      lines,
    }),
  );
}

function mapTerminalInfoSpotFormToInput(
  infoSpot: TerminalInfoSpotFormState,
): StopRegistryInfoSpotInput {
  return {
    id: infoSpot.infoSpotId,
    backlight: infoSpot.backlight,
    description: {
      lang: infoSpot.description?.lang,
      value: infoSpot.description?.value,
    },
    geometry: mapPointToStopRegistryGeoJSON(infoSpot),
    displayType: mapNullEnumOption(infoSpot.displayType),
    floor: infoSpot.floor,
    label: infoSpot.label,
    width: infoSpot.size.width,
    height: infoSpot.size.height,
    infoSpotLocations: infoSpot.infoSpotLocations,
    infoSpotType: mapNullEnumOption(infoSpot.infoSpotType),
    purpose: mapPurposeToString(infoSpot.purpose),
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    zoneLabel: infoSpot.zoneLabel,
    poster: mapPosterInput(infoSpot.poster),
  };
}

function handleDeletions(
  infoSpot: TerminalInfoSpotFormState,
): TerminalInfoSpotFormState {
  return {
    ...infoSpot,
    poster:
      infoSpot.poster?.filter((poster) => !poster.toBeDeletedPoster) ?? [],
    infoSpotLocations: infoSpot.toBeDeleted ? [] : infoSpot.infoSpotLocations,
  };
}

export const useEditTerminalInfoSpots = () => {
  const { t } = useTranslation();
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation({
    refetchQueries: [GetParentStopPlaceDetailsDocument],
  });

  const saveTerminalInfoSpots = async (params: {
    state: TerminalInfoSpotFormState;
  }): Promise<string | undefined> => {
    const response = await updateInfoSpotMutation({
      variables: {
        input: mapTerminalInfoSpotFormToInput(handleDeletions(params.state)),
      },
    });

    const rawInfoSpots = response.data?.stop_registry?.mutateInfoSpots;
    if (!rawInfoSpots || rawInfoSpots.length === 0) {
      return undefined;
    }

    return rawInfoSpots[0]?.id ?? undefined;
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    saveTerminalInfoSpots,
    defaultErrorHandler,
  };
};
