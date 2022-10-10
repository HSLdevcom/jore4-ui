import { LineTableRowFragment } from '../../../generated/graphql';
import { LineTableRow } from './LineTableRow';
import { RoutesTable } from './RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
  isSelecting?: boolean;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList = ({
  lines,
  isSelecting = false,
}: Props): JSX.Element => (
  <RoutesTable testId={testIds.table}>
    {lines?.map((item: LineTableRowFragment) => (
      <LineTableRow key={item.line_id} line={item} isSelectable={isSelecting} />
    ))}
  </RoutesTable>
);
