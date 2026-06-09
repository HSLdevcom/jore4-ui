import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { VersionRowCells } from '../../../../common/versions';
import { LocatorActionButton } from '../../../components';
import { StopVersion } from '../types';
import { ActionMenuStop } from '../types/ActionMenuStop';
import { StopVersionActionMenu } from './StopVersionActionMenu';

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
      <VersionRowCells version={stopVersion} testIdPrefix="StopVersionRow" />

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
