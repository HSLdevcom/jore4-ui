import { LineTableRow } from '..';
import { LineTableRowFragment } from '../../../generated/graphql';
import { Path, routeDetails } from '../../../router/routeDetails';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
  basePath: Path;
  areItemsSelectable?: boolean;
};

const testIds = {
  table: 'LinesList::table',
};

export const LinesList = ({
  lines,
  basePath,
  areItemsSelectable = false,
}: Props): JSX.Element => (
  <RoutesTable testId={testIds.table}>
    {lines?.map((item: LineTableRowFragment) => (
      <LineTableRow
        key={item.line_id}
        linkTo={routeDetails[basePath].getLink(item.line_id)}
        line={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
