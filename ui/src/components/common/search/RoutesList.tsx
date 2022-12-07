import qs from 'qs';
import { RouteTableRow } from '..';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { QueryParameterName } from '../../../hooks';
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
}: Props): JSX.Element => {
  const getRouteDetailsLink = (lineId: UUID, routeLabel: string) =>
    `${routeDetails[basePath].getLink(lineId)}?${qs.stringify({
      [QueryParameterName.RouteLabels]: routeLabel,
    })}`;

  return (
    <RoutesTable testId={testIds.table}>
      {routes?.map((item: RouteTableRowFragment) => (
        <RouteTableRow
          key={item.route_id}
          linkTo={getRouteDetailsLink(item.on_line_id, item.label)}
          route={item}
          isSelectable={areItemsSelectable}
        />
      ))}
    </RoutesTable>
  );
};
