import {
  StopAreaDetailsFragment,
  StopAreaDetailsMembersFragment,
} from '../../../../generated/graphql';
import { getStopPlacesFromQueryResult, notNullish } from '../../../../utils';
import { StopSearchRow } from '../../search';

export function mapMemberToStopSearchFormat(
  member: StopAreaDetailsMembersFragment,
): StopSearchRow | null {
  if (!member.scheduled_stop_point) {
    return null;
  }

  return {
    ...member.scheduled_stop_point,
    quay: {
      netexId: member.id,
      nameFin: member.name?.value,
      nameSwe: null,
    },
  };
}

export function mapMembersToStopSearchFormat(
  area: StopAreaDetailsFragment,
): Array<StopSearchRow> {
  return getStopPlacesFromQueryResult<StopAreaDetailsMembersFragment>(
    area.members,
  )
    .map(mapMemberToStopSearchFormat)
    .filter(notNullish);
}
