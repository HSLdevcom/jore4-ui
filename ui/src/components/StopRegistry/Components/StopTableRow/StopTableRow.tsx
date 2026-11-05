import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  ActionButtonsTd,
  ActionMenuTd,
  IconsTd,
  LabelAndTimingPlaceTd,
  NameAndIconsTd,
  NameTd,
  PlatformNumberTd,
  PriorityTd,
  ValidityPeriodTd,
} from './components';
import { SelectRowTd } from './components/SelectRowTd';
import { stopTableCellClassNames as cells } from './stopTableCellClassNames';
import { StopSearchRow } from './types';

type StopTableRowBaseProps = {
  readonly actionButtons: ReactNode;
  readonly className?: string;
  readonly menuItems: ReactNode;
  readonly observationDate: Temporal.PlainDate;
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
      className={twMerge(cells.row, className)}
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

      <PriorityTd className={cells.priority} stop={stop} />

      <LabelAndTimingPlaceTd
        className={cells.label}
        observationDate={observationDate}
        stop={stop}
      />

      <PlatformNumberTd className={cells.platformNumber} stop={stop} />

      <NameTd className={cells.nameWide} stop={stop} />

      <IconsTd className={cells.iconsWide} stop={stop} />

      <NameAndIconsTd className={cells.nameAndIconsNarrow} stop={stop} />

      <ValidityPeriodTd className={cells.validity} stop={stop} />

      <ActionButtonsTd
        actionButtons={actionButtons}
        className={cells.actionButtons}
      />

      <ActionMenuTd className={cells.actionMenu} menuItems={menuItems} />
    </tr>
  );
};
