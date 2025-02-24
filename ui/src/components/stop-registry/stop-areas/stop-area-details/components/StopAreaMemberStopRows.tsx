import { TFunction } from 'i18next';
import groupBy from 'lodash/groupBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { EnrichedStopPlace } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { StopAreaFormMember } from '../../../../forms/stop-area';
import { StopSearchRow, StopTableRow } from '../../../search';
import { LocatorActionButton } from '../../../search/StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from '../../../search/StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../../../search/StopTableRow/MenuItems/ShowOnMap';
import { mapMembersToStopSearchFormat } from '../utils';
import { EditModeActionButton } from './MemberStopMenuActionButtons/EditModeActionButton';
import { RemoveMemberStop } from './MemberStopMenuItems/RemoveMemberStop';
import { StopAreaComponentProps } from './StopAreaComponentProps';

type StopAreaMemberRow = {
  readonly quay: StopSearchRow;
  readonly selected: boolean;
  readonly added: boolean;
};

function groupBySelectionStatus(
  existingAreaMembers: ReadonlyArray<StopSearchRow>,
  selectedIds: ReadonlyArray<string>,
): Record<'selected' | 'removed', Array<StopSearchRow>> {
  const grouped = groupBy(existingAreaMembers, (it) =>
    selectedIds.includes(it.quay.netexId as string) ? 'selected' : 'removed',
  );
  return {
    selected: grouped.selected ?? [],
    removed: grouped.removed ?? [],
  };
}

/**
 * Constructs an imitation of StopSearchRow data
 * @param member
 */
function stopAreaFormMemberToStopSearchRow(
  member: StopAreaFormMember,
): StopSearchRow {
  return {
    quay: {
      netexId: member.id,
      nameFin: member.name.value,
      nameSwe: '',
    },

    // Incorrect, but unique
    scheduled_stop_point_id: member.id,

    label: member.scheduled_stop_point.label,
    measured_location: {
      type: 'Point',
      coordinates: [0, 0],
    },

    // Assume default priority
    priority: Priority.Standard,
  };
}

function getStatusText(t: TFunction, row: StopAreaMemberRow): string {
  if (row.added) {
    return t('stopAreaDetails.memberStops.statusTag.added');
  }

  if (!row.selected) {
    return t('stopAreaDetails.memberStops.statusTag.removed');
  }

  return '';
}

// A hackish way to add extra info tag to the row in edit mode.
function tagRowWithStatusText(
  t: TFunction,
  row: StopAreaMemberRow,
): StopAreaMemberRow {
  return {
    ...row,
    quay: {
      ...row.quay,
      timing_place: {
        __typename: 'timing_pattern_timing_place',
        timing_place_id: '',
        label: getStatusText(t, row),
      },
    },
  };
}

function mapRows(
  t: TFunction,
  area: EnrichedStopPlace,
  inEditMode: boolean,
  inEditSelectedStops: ReadonlyArray<StopAreaFormMember>,
): Array<StopAreaMemberRow> {
  const existingAreaMembers = mapMembersToStopSearchFormat(area);

  if (!inEditMode) {
    return existingAreaMembers.map((quay) => ({
      quay,
      selected: true,
      added: false,
    }));
  }

  const selectedIds = inEditSelectedStops.map((it) => it.id);
  const { selected, removed } = groupBySelectionStatus(
    existingAreaMembers,
    selectedIds,
  );

  const existingIds = existingAreaMembers.map((it) => it.quay.netexId);
  const added = inEditSelectedStops
    .filter((it) => !existingIds.includes(it.id))
    .map(stopAreaFormMemberToStopSearchRow);

  return [
    ...selected.map((quay) => ({ quay, selected: true, added: false })),
    ...removed.map((quay) => ({ quay, selected: false, added: false })),
    ...added.map((quay) => ({ quay, selected: true, added: true })),
  ]
    .map((row) => tagRowWithStatusText(t, row))
    .sort((a, b) => a.quay.label.localeCompare(b.quay.label));
}

function getRowBgClassName(added: boolean, selected: boolean) {
  if (added) {
    return 'bg-background-hsl-green-10';
  }

  if (!selected) {
    return 'bg-background text-grey';
  }

  return '';
}

type StopAreaMemberStopRowsProps = StopAreaComponentProps & {
  readonly onRemove: (stopId: string) => void;
  readonly onAddBack: (member: StopAreaFormMember) => void;
  readonly inEditSelectedStops: ReadonlyArray<StopAreaFormMember>;
  readonly inEditMode: boolean;
};

export const StopAreaMemberStopRows: FC<StopAreaMemberStopRowsProps> = ({
  area,
  className = '',
  inEditSelectedStops,
  inEditMode,
  onAddBack,
  onRemove,
}) => {
  const { t } = useTranslation();

  return (
    <table
      className={twMerge(
        'mt-4 h-1 w-full border-x border-x-light-grey',
        className,
      )}
    >
      <tbody>
        {mapRows(t, area, inEditMode, inEditSelectedStops).map(
          ({ quay, selected, added }) => (
            <StopTableRow
              className={getRowBgClassName(added, selected)}
              key={quay.scheduled_stop_point_id}
              inEditMode={inEditMode}
              stop={quay}
              actionButtons={
                inEditMode ? (
                  <EditModeActionButton
                    onAddBack={onAddBack}
                    onRemove={onRemove}
                    selected={selected}
                    stop={quay}
                  />
                ) : (
                  <LocatorActionButton stop={quay} />
                )
              }
              menuItems={[
                <OpenDetailsPage key="OpenDetailsPage" stop={quay} />,
                <RemoveMemberStop
                  key="RemoveMemberStop"
                  stop={quay}
                  onRemove={onRemove}
                />,
                <ShowOnMap key="ShowOnMap" stop={quay} />,
              ]}
            />
          ),
        )}
      </tbody>
    </table>
  );
};
