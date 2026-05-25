import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { AccessibilityAssessmentDetailsFragment } from '../../../../generated/graphql';
import { EnrichedQuay, StopWithDetails } from '../../../../types';

/**
 * Returns a translated string that includes all stop types of a given stop place.
 */
export const translateStopTypes = (
  t: TFunction,
  quay?: Pick<EnrichedQuay, 'stopType'> | null | undefined,
) => {
  if (!quay) {
    return '';
  }

  const result = compact([
    quay.stopType.railReplacement && t(($) => $.stopPlaceTypes.railReplacement),
    quay.stopType.virtual && t(($) => $.stopPlaceTypes.virtual),
    quay.stopType.trunkLineStop && t(($) => $.stopPlaceTypes.trunkLineStop),
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
  t: TFunction,
  value: boolean | undefined | null,
) => {
  if (value) {
    return t(($) => $.yes);
  }

  if (value === false) {
    return t(($) => $.no);
  }

  return undefined;
};

/**
 * Maps a boolean to a custom text values.
 *
 * Missing values are NOT translated.
 */
export const optionalBooleanToCustomUiText = (
  value: boolean | undefined | null,
  ifTrue: string,
  ifFalse: string,
) => {
  if (value) {
    return ifTrue;
  }

  if (value === false) {
    return ifFalse;
  }

  return undefined;
};

export const extractRelevantAccessibilityAssessment = (
  stop: StopWithDetails,
): AccessibilityAssessmentDetailsFragment | null => {
  return (
    stop?.quay?.accessibilityAssessment ??
    stop?.stop_place?.accessibilityAssessment ??
    null
  );
};
