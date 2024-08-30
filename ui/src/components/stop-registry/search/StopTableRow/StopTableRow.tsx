import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopSearchRow } from '../../../../hooks';
import { ActionButtonsTd } from './ActionButtonsTd';
import { ActionMenuTd } from './ActionMenuTd';
import { LabelAndTimingPlaceTd } from './LabelAndTimingPlaceTd';
import { NameTd } from './NameTd';
import { ValidityPeriodTd } from './ValidityPeriodTd';

interface Props {
  readonly className?: string;
  readonly menuItems: ReactNode;
  readonly stop: StopSearchRow;
}

const testIds = {
  row: (label: string) => `StopTableRow::row::${label}`,
};

const yBorderClassNames = 'border-y border-y-light-grey';

export const StopTableRow: FC<Props> = ({
  className = '',
  menuItems,
  stop,
}) => {
  return (
    <tr
      className={twMerge('text-hsl-dark-80', className)}
      data-testid={testIds.row(stop.label)}
    >
      {/* TODO: select column */}
      {/* TODO: alert style column */}

      <LabelAndTimingPlaceTd
        className={`w-auto px-8 py-3 pr-20 ${yBorderClassNames}`}
        stop={stop}
      />

      <NameTd
        className={`w-full px-8 py-3 ${yBorderClassNames} align-top text-sm font-bold leading-6`}
        stop={stop}
      />

      <ValidityPeriodTd
        className={`w-auto px-8 py-3 ${yBorderClassNames} whitespace-nowrap border-l border-l-background`}
        stop={stop}
      />

      <ActionButtonsTd
        className={`w-auto py-3 ${yBorderClassNames}`}
        stop={stop}
      />

      <ActionMenuTd
        className={`w-auto py-3 pl-3 pr-8 ${yBorderClassNames}`}
        menuItems={menuItems}
      />
    </tr>
  );
};
