import { FC } from 'react';
import { LineTableRow, RouteLineTableRowVariant } from '..';
import { LineTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type LinesListProps = {
  readonly lines?: ReadonlyArray<LineTableRowFragment>;
  readonly areItemsSelectable?: boolean;
  readonly rowVariant: RouteLineTableRowVariant;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList: FC<LinesListProps> = ({
  lines,
  areItemsSelectable = false,
  rowVariant,
}) => (
  <RoutesTable testId={testIds.table}>
    {lines?.map((item: LineTableRowFragment) => (
      <LineTableRow
        rowVariant={rowVariant}
        key={item.line_id}
        line={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
