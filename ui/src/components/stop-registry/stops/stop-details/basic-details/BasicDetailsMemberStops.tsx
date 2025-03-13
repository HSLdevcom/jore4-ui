import { TFunction } from 'i18next';
import { StopWithDetails } from '../../../../../types';

export function getQuayPublicCodes(stop: StopWithDetails): string[] {
  const quays = stop.stop_place?.quays ?? [];

  return quays
    .filter((quay) => quay?.scheduled_stop_point?.priority === 10)
    .map((quay) => quay?.publicCode)
    .filter(Boolean) as string[];
}

export function getFormattedQuayCodes(
  stop: StopWithDetails,
  t: TFunction,
): string {
  const quayPublicCodes = getQuayPublicCodes(stop);

  return quayPublicCodes.length > 0
    ? quayPublicCodes.join(', ')
    : t('stopDetails.basicAreaDetails.areaNoMemberStops');
}
