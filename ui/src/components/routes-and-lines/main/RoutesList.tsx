import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { RoutesTable } from './RoutesTable';
import { RouteTableRow } from './RouteTableRow';

type Props = {
  routes?: RouteAllFieldsFragment[];
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
    {routes?.map((item: RouteAllFieldsFragment) => (
      <RouteTableRow
        key={item.route_id}
        route={item}
        isSelectable={areItemsSelectable}
      />
    ))}
  </RoutesTable>
);
