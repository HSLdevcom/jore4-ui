import { RouteTableRow } from '..';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { Path, routeDetails } from '../../../router/routeDetails';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  routes?: RouteTableRowFragment[];
  basePath: Path;
  areItemsSelectable?: boolean;
};

const testIds = {
  table: 'RoutesList::table',
};

export const RoutesList = ({
  routes,
  basePath,
  areItemsSelectable = false,
}: Props): JSX.Element => (
  <RoutesTable testId={testIds.table}>
    {routes?.map((item: RouteTableRowFragment) => (
      <RouteTableRow
        key={item.route_id}
        linkTo={routeDetails[basePath].getLink(item.on_line_id)}
        route={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
