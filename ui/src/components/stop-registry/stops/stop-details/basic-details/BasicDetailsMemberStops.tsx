import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { StopWithDetails } from '../../../../../types';

export function getQuayPublicCodes(stop: StopWithDetails): string[] {
  const quays = stop.stop_place?.quays ?? [];

  return uniq(compact(quays.map((quay) => quay?.publicCode))).sort();
}

export function getFormattedQuayCodes(
  t: TFunction,
  stop: StopWithDetails,
): string {
  const quayPublicCodes = getQuayPublicCodes(stop);

  return quayPublicCodes.length > 0
    ? quayPublicCodes.join(', ')
    : t('stopDetails.basicAreaDetails.areaNoMemberStops');
}
