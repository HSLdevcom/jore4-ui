import {
  QuayDetailsFragment,
} from '../../../../generated/graphql';
import { StopPlaceWithDetails } from '../../../../hooks';
import { notNullish } from '../../../../utils';
import { StopSearchRow } from '../../search';

export function mapMemberToStopSearchFormat(
  quay: QuayDetailsFragment | null,
): StopSearchRow | null {
  if (!quay?.scheduled_stop_point) {
    return null;
  }

  return {
    ...quay?.scheduled_stop_point,
    quay: {
      netexId: quay?.id,
      nameFin: quay?.description?.value,
      nameSwe: null,
    },
  };
}

export function mapMembersToStopSearchFormat(
  area: StopPlaceWithDetails,
): Array<StopSearchRow> {
  return (area.stop_place?.quays ?? [])
    .map(mapMemberToStopSearchFormat)
    .filter(notNullish);
}