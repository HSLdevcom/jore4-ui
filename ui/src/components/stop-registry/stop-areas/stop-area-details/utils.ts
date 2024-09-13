import {
  StopAreaDetailsFragment,
  StopAreaDetailsMembersFragment,
} from '../../../../generated/graphql';
import { StopSearchRow } from '../../../../hooks';
import { getStopPlacesFromQueryResult, notNullish } from '../../../../utils';

export function mapMemberToStopSearchFormat(
  member: StopAreaDetailsMembersFragment,
): StopSearchRow | null {
  if (!member.scheduled_stop_point) {
    return null;
  }

  return {
    ...member.scheduled_stop_point,
    stop_place: {
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
