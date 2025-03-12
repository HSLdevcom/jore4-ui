import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { mapToShortDate, mapToShortDateTime } from '../../../../../time';
import { LocatorActionButton } from '../../../components';
import { StopVersion, StopVersionStatus } from '../types';
import { ActionMenuStop } from '../types/ActionMenuStop';
import { trStatus } from '../utils';
import { StopVersionActionMenu } from './StopVersionActionMenu';

const testIds = {
  status: 'StopVersionRow::status',
  validityStart: 'StopVersionRow::validityStart',
  validityEnd: 'StopVersionRow::validityEnd',
  versionComment: 'StopVersionRow::versionComment',
  changed: 'StopVersionRow::changed',
  changedBy: 'StopVersionRow::changedBy',
};

function statusToCellClasses(status: StopVersionStatus): string {
  switch (status) {
    case StopVersionStatus.ACTIVE:
      return 'bg-hsl-dark-green text-white';

    case StopVersionStatus.STANDARD:
      return 'bg-tweaked-brand text-white';

    case StopVersionStatus.TEMPORARY:
      return 'bg-city-bicycle-yellow';

    case StopVersionStatus.DRAFT:
      return 'bg-background';

    default:
      return '';
  }
}

type StopVersionRowProps = {
  readonly className?: string;
  readonly publicCode: string;
  readonly stopVersion: StopVersion;
};

export const StopVersionRow: FC<StopVersionRowProps> = ({
  className,
  publicCode,
  stopVersion,
}) => {
  const { t } = useTranslation();

  const stopForActions: ActionMenuStop = {
    label: publicCode,
    netextId: stopVersion.netex_id,
    location: stopVersion.location,
    startDate: stopVersion.validity_start,
    priority: stopVersion.priority,
  };

  return (
    <tr
      className={twMerge(
        'text-nowrap border-b *:border-x *:px-4 *:py-2',
        className,
      )}
      data-test-element-type="StopVersionRow"
    >
      <td
        className={twJoin(
          'text-center',
          statusToCellClasses(stopVersion.status),
        )}
        data-testid={testIds.status}
      >
        {trStatus(t, stopVersion.status)}
      </td>

      <td
        className="!border-r-0 text-right"
        data-testid={testIds.validityStart}
      >
        {mapToShortDate(stopVersion.validity_start)}
      </td>

      <td className="!border-x-0 !p-0">-</td>

      <td className="!border-l-0 text-right" data-testid={testIds.validityEnd}>
        {mapToShortDate(stopVersion.validity_end)}
      </td>

      <td className="text-pretty" data-testid={testIds.versionComment}>
        {stopVersion.version_comment}
      </td>

      <td className="text-right" data-testid={testIds.changed}>
        {mapToShortDateTime(stopVersion.changed)}
      </td>

      <td data-testid={testIds.changedBy}>{stopVersion.changed_by}</td>

      <td className="!px-2">
        <LocatorActionButton
          observeOnStopValidityStartDate
          stop={stopForActions}
        />
      </td>

      <td className="!p-0">
        <StopVersionActionMenu className="p-2" stop={stopForActions} />
      </td>
    </tr>
  );
};
