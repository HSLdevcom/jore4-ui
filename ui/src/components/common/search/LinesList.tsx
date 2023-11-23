import { LineTableRow, RouteLineTableRowVariant } from '..';
import { LineTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
  areItemsSelectable?: boolean;
  rowVariant: RouteLineTableRowVariant;
  selectedAlert?: unknown;
  setSelectedAlert: (selectedAlert: unknown | undefined) => void;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList = ({
  lines,
  areItemsSelectable = false,
  rowVariant,
  selectedAlert,
  setSelectedAlert,
}: Props): JSX.Element => {
  return (
    <RoutesTable testId={testIds.table}>
      {lines?.map((item: LineTableRowFragment) => (
        <LineTableRow
          rowVariant={rowVariant}
          key={item.line_id}
          line={item}
          isSelectable={areItemsSelectable}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      ))}
    </RoutesTable>
  );
};
