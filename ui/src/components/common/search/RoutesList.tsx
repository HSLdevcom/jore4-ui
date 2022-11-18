import { RouteLineTableRowVariant, RouteTableRow } from '..';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  routes?: RouteTableRowFragment[];
  areItemsSelectable?: boolean;
  rowVariant: RouteLineTableRowVariant;
};

const testIds = {
  table: 'RoutesList::table',
};

export const RoutesList = ({
  routes,
  areItemsSelectable = false,
  rowVariant,
}: Props): JSX.Element => (
  <RoutesTable testId={testIds.table}>
    {routes?.map((item: RouteTableRowFragment) => (
      <RouteTableRow
        rowVariant={rowVariant}
        key={item.route_id}
        route={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
