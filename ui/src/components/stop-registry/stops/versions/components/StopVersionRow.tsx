import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { mapToShortDate, mapToShortDateTime } from '../../../../../time';
import { statusToCellClasses } from '../../../../common/versions';
import { trStatus } from '../../../../common/versions/trStatus';
import { LocatorActionButton } from '../../../components';
import { StopVersion } from '../types';
import { ActionMenuStop } from '../types/ActionMenuStop';
import { StopVersionActionMenu } from './StopVersionActionMenu';

const testIds = {
  status: 'StopVersionRow::status',
  validityStart: 'StopVersionRow::validityStart',
  validityEnd: 'StopVersionRow::validityEnd',
  versionComment: 'StopVersionRow::versionComment',
  changed: 'StopVersionRow::changed',
  changedBy: 'StopVersionRow::changedBy',
};

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
    netexId: stopVersion.netex_id,
    location: stopVersion.location,
    startDate: stopVersion.validity_start,
    priority: stopVersion.priority,
  };

  return (
    <tr
      className={twMerge('border-b text-nowrap *:border-x', className)}
      data-test-element-type="StopVersionRow"
    >
      <td
        className={twJoin(
          'px-4 py-2 text-center',
          statusToCellClasses(stopVersion.status),
        )}
        data-testid={testIds.status}
      >
        {trStatus(t, stopVersion.status)}
      </td>

      <td
        className="border-r-0! px-4 py-2 text-right"
        data-testid={testIds.validityStart}
      >
        {mapToShortDate(stopVersion.validity_start)}
      </td>

      <td className="border-x-0! p-0">-</td>

      <td
        className="border-l-0! px-4 py-2 text-right"
        data-testid={testIds.validityEnd}
      >
        {mapToShortDate(stopVersion.validity_end)}
      </td>

      <td
        className="px-4 py-2 text-pretty"
        data-testid={testIds.versionComment}
      >
        {stopVersion.version_comment}
      </td>

      <td className="px-4 py-2 text-center" data-testid={testIds.changed}>
        {mapToShortDateTime(stopVersion.changed)}
      </td>

      <td className="px-4 py-2 text-center" data-testid={testIds.changedBy}>
        {stopVersion.changedByUserName ?? 'HSL'}
      </td>

      <td className="p-2">
        <LocatorActionButton
          observationDate={stopVersion.validity_start}
          stop={stopForActions}
        />
      </td>

      <td>
        <StopVersionActionMenu className="p-2" stop={stopForActions} />
      </td>
    </tr>
  );
};
