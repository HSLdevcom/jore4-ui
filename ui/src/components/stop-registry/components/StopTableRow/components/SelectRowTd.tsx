import { FC } from 'react';
import { StopSearchRow } from '../types';

type SelectRowTdProps = {
  readonly className?: string;
  readonly isSelected: boolean;
  readonly onToggleSelection: (rowId: string) => void;
  readonly stop: StopSearchRow;
};

const testIds = {
  selectInput: 'StopTableRow::selectInput',
};

export const SelectRowTd: FC<SelectRowTdProps> = ({
  className,
  isSelected,
  onToggleSelection,
  stop,
}) => {
  return (
    <td aria-label={stop.publicCode} className={className}>
      <input
        checked={isSelected}
        className="h-7 w-7 accent-tweaked-brand"
        data-testid={testIds.selectInput}
        onChange={() => onToggleSelection(stop.id)}
        type="checkbox"
      />
    </td>
  );
};
