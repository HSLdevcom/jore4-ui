import { QuayDetailsFragment } from '../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../types';
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
  area: EnrichedStopPlace,
): Array<StopSearchRow> {
  return (area.quays ?? []).map(mapMemberToStopSearchFormat).filter(notNullish);
}
