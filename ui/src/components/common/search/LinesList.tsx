import { LineTableRow, RouteLineTableRowVariant } from '..';
import { LineTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
  areItemsSelectable?: boolean;
  rowVariant: RouteLineTableRowVariant;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList = ({
  lines,
  areItemsSelectable = false,
  rowVariant,
}: Props): JSX.Element => (
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
