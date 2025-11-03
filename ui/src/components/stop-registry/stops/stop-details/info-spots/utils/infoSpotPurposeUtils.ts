import { TFunction } from 'i18next';
import { mapInfoSpotPurposeToUiName } from '../../../../../../i18n/uiNameMappings';
import { InfoSpotPurposeState } from '../types';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';

export function stringToInfoSpotPurposeEnum(
  purposeString: string | null | undefined,
): InfoSpotPurposeEnum | null {
  if (!purposeString) {
    return null;
  }

  const upperPurpose = purposeString.toUpperCase();
  return Object.values(InfoSpotPurposeEnum).includes(
    upperPurpose as InfoSpotPurposeEnum,
  )
    ? (upperPurpose as InfoSpotPurposeEnum)
    : null;
}

export function mapPurposeToString(purpose: {
  purposeType: InfoSpotPurposeEnum;
  customPurpose: string | null;
}): string | null {
  if (purpose.purposeType === InfoSpotPurposeEnum.NULL) {
    return null;
  }

  if (purpose.purposeType === InfoSpotPurposeEnum.OTHER) {
    return purpose.customPurpose;
  }

  return purpose.purposeType.toLowerCase();
}

export function mapStringToPurpose(
  purposeString: string | null | undefined,
): InfoSpotPurposeState {
  if (!purposeString) {
    return {
      purposeType: InfoSpotPurposeEnum.NULL,
      customPurpose: null,
    };
  }

  const enumValue = stringToInfoSpotPurposeEnum(purposeString);
  return enumValue
    ? { purposeType: enumValue, customPurpose: null }
    : { purposeType: InfoSpotPurposeEnum.OTHER, customPurpose: purposeString };
}

export function formatPurposeForDisplay(
  t: TFunction,
  purpose: string | null | undefined,
): string {
  if (!purpose) {
    return mapInfoSpotPurposeToUiName(t, InfoSpotPurposeEnum.NULL);
  }

  const enumValue = stringToInfoSpotPurposeEnum(purpose);
  if (enumValue) {
    return mapInfoSpotPurposeToUiName(t, enumValue);
  }

  // Show legacy purposes in raw string
  return purpose;
}
