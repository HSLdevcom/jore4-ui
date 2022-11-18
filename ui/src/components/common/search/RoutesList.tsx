import { RouteTableRow } from '..';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

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
}: Props): JSX.Element => {
  return (
    <RoutesTable testId={testIds.table}>
      {routes?.map((item: RouteTableRowFragment) => (
        <RouteTableRow
          key={item.route_id}
          route={item}
          isSelectable={areItemsSelectable}
        />
      ))}
    </RoutesTable>
  );
};
