import { LineTableRow } from '..';
import { LineTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
  areItemsSelectable?: boolean;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList = ({
  lines,
  areItemsSelectable = false,
}: Props): JSX.Element => {
  return (
    <RoutesTable testId={testIds.table}>
      {lines?.map((item: LineTableRowFragment) => (
        <LineTableRow
          key={item.line_id}
          line={item}
          isSelectable={areItemsSelectable}
        />
      ))}
    </RoutesTable>
  );
};
