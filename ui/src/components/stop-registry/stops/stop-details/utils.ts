import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
} from '../../../../generated/graphql';
import { EnrichedQuay } from '../../../../hooks';
import { i18n } from '../../../../i18n';

/**
 * Returns a translated string that includes all stop types of a given stop place.
 */
export const translateStopTypes = (
  quay?: Pick<EnrichedQuay, 'stopType'> | null | undefined,
) => {
  const result = compact([
    quay?.stopType.mainLine && i18n.t('stopPlaceTypes.mainLine'),
    quay?.stopType.interchange && i18n.t('stopPlaceTypes.interchange'),
    quay?.stopType.railReplacement && i18n.t('stopPlaceTypes.railReplacement'),
    quay?.stopType.virtual && i18n.t('stopPlaceTypes.virtual'),
  ])
    // Uncapitalize each translation.
    .map((stopType) => stopType.charAt(0).toLowerCase() + stopType.slice(1))
    .join(', ');

  // Capitalize the final result.
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Maps a boolean to a translated yes/no text.
 *
 * Missing values are NOT translated.
 */
export const optionalBooleanToUiText = (
  value: boolean | undefined | null,
  translations: { true: string; false: string } = {
    true: i18n.t('yes'),
    false: i18n.t('no'),
  },
) => {
  if (value) {
    return translations.true;
  }
  if (value === false) {
    return translations.false;
  }
  return undefined;
};

const trInfoSpotDisplayTypeMap: Readonly<
  Record<StopRegistryDisplayType, (t: TFunction) => string>
> = {
  [StopRegistryDisplayType.BatteryEInk]: (t) =>
    t('stopDetails.infoSpots.displayTypes.batteryEInk'),
  [StopRegistryDisplayType.BatteryMultiRow]: (t) =>
    t('stopDetails.infoSpots.displayTypes.batteryMultiRow'),
  [StopRegistryDisplayType.BatteryOneRow]: (t) =>
    t('stopDetails.infoSpots.displayTypes.batteryOneRow'),
  [StopRegistryDisplayType.ChargeableEInk]: (t) =>
    t('stopDetails.infoSpots.displayTypes.chargeableEInk'),
  [StopRegistryDisplayType.ElectricTft]: (t) =>
    t('stopDetails.infoSpots.displayTypes.electricTFT'),
  [StopRegistryDisplayType.None]: (t) =>
    t('stopDetails.infoSpots.displayTypes.none'),
};

export const trInfoSpotDisplayType = (
  t: TFunction,
  type?: StopRegistryDisplayType | null,
) => {
  if (type) {
    return trInfoSpotDisplayTypeMap[type](t);
  }

  return null;
};

const trInfoSpotTypeMap: Readonly<
  Record<StopRegistryInfoSpotType, (t: TFunction) => string>
> = {
  [StopRegistryInfoSpotType.Dynamic]: (t) =>
    t('stopDetails.infoSpots.type.dynamic'),
  [StopRegistryInfoSpotType.Static]: (t) =>
    t('stopDetails.infoSpots.type.static'),
  [StopRegistryInfoSpotType.SoundBeacon]: (t) =>
    t('stopDetails.infoSpots.type.sound_beacon'),
};

export const trInfoSpotType = (
  t: TFunction,
  type?: StopRegistryInfoSpotType | null,
) => {
  if (type) {
    return trInfoSpotTypeMap[type](t);
  }

  return null;
};

export const formatDimension = (dimension: string | undefined | null) => {
  // Extract the numerical part from the string
  const match = dimension?.match(/^cm(\d+x\d+)$/);

  if (!match) {
    return dimension;
  }

  // Extract the dimension part
  const extractedDimension = match[1];

  // Return the reformatted string
  return `${extractedDimension}cm`;
};
