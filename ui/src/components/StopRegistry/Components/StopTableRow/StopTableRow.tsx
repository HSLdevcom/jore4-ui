import { DateTime } from 'luxon';
import { FC, ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import {
  ActionButtonsTd,
  ActionMenuTd,
  LabelAndTimingPlaceTd,
  NameTd,
  PriorityTd,
  ValidityPeriodTd,
} from './components';
import { IconsTd } from './components/IconsTd';
import { NameAndIconsTd } from './components/NameAndIconsTd';
import { PlatformNumberTd } from './components/PlatformNumberTd';
import { SelectRowTd } from './components/SelectRowTd';
import { StopSearchRow } from './types';

type StopTableRowBaseProps = {
  readonly actionButtons: ReactNode;
  readonly className?: string;
  readonly menuItems: ReactNode;
  readonly observationDate: DateTime;
  readonly stop: StopSearchRow;
};

export type SelectableStopTableRowProps = {
  readonly selectable: true;
  readonly isSelected: boolean;
  readonly onToggleSelection: (rowId: string) => void;
  readonly compact?: never;
};

export type NonSelectableStopTableRowProps = {
  readonly selectable?: false | never;
  readonly isSelected?: never;
  readonly onToggleSelection?: never;
};

type StopTableRowProps = StopTableRowBaseProps &
  (SelectableStopTableRowProps | NonSelectableStopTableRowProps);

const testIds = {
  row: (label: string) => `StopTableRow::row::${label}`,
};

const yBorder = 'border-y border-y-light-grey';
const lBorder = 'border-l border-l-background';
const atWide = '@max-5xl:hidden';
const atNarrow = '@5xl:hidden';

export const StopTableRow: FC<StopTableRowProps> = ({
  actionButtons,
  className,
  isSelected,
  menuItems,
  observationDate,
  onToggleSelection,
  selectable,
  stop,
}) => {
  return (
    <tr
      className={twMerge('text-hsl-dark-80', className)}
      data-testid={testIds.row(stop.publicCode)}
      data-netex-id={stop.netexId}
      data-scheduled-stop-point-id={stop.scheduledStopPointId}
    >
      {selectable && (
        <SelectRowTd
          className="w-auto border-r border-r-light-grey pr-5"
          isSelected={isSelected}
          onToggleSelection={onToggleSelection}
          stop={stop}
        />
      )}

      <PriorityTd className={twJoin(yBorder, 'w-0')} stop={stop} />

      <LabelAndTimingPlaceTd
        className={twJoin(yBorder, 'w-0 p-3 align-top')}
        observationDate={observationDate}
        stop={stop}
      />

      <PlatformNumberTd className={twJoin(yBorder, 'p-3 pl-0')} stop={stop} />

      <NameTd
        className={twJoin(
          yBorder,
          lBorder,
          atWide,
          'w-full p-3 align-top text-sm @5xl:px-8',
        )}
        stop={stop}
      />

      <IconsTd
        className={twJoin(
          yBorder,
          lBorder,
          atWide,
          'w-auto p-3 whitespace-nowrap',
        )}
        stop={stop}
      />

      <NameAndIconsTd
        className={twJoin(
          yBorder,
          lBorder,
          atNarrow,
          'w-full p-3 align-top whitespace-nowrap',
        )}
        stop={stop}
      />

      <ValidityPeriodTd
        className={twJoin(
          yBorder,
          lBorder,
          'w-auto p-3 align-top @5xl:px-8',
          // Align to the center of the action buttons/menu
          // calc: (h-10)[action btn height] - 1rem [text height] / 2 + pt-3
          '@5xl:pt-[calc((((var(--spacing)*10)-1rem)/2)+(var(--spacing)*3))]',
        )}
        stop={stop}
      />

      <ActionButtonsTd
        actionButtons={actionButtons}
        className={twJoin(yBorder, 'w-0 py-3 pr-1 align-top @max-5xl:hidden')}
      />

      <ActionMenuTd
        className={twJoin(yBorder, 'w-0 p-3 pr-4 align-top')}
        menuItems={menuItems}
      />
    </tr>
  );
};
