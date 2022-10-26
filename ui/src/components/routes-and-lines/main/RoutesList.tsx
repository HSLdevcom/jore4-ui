import { RouteTableRowFragment } from '../../../generated/graphql';
import { Path, routeDetails } from '../../../router/routeDetails';
import { RouteTableRow } from '../../common';
import { RoutesTable } from './RoutesTable';

type Props = {
  routes?: RouteTableRowFragment[];
  areItemsSelectable?: boolean;
};

const testIds = {
  table: 'RoutesList::table',
};

export const RoutesList = ({
  routes,
  areItemsSelectable = false,
}: Props): JSX.Element => (
  <RoutesTable testId={testIds.table}>
    {routes?.map((item: RouteTableRowFragment) => (
      <RouteTableRow
        key={item.route_id}
        linkTo={routeDetails[Path.lineDetails].getLink(item.on_line_id)}
        route={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
