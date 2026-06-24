import { FC } from 'react';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../main/RoutesTable';
import { RouteTableRow } from './RouteTableRow';
import { RouteLineTableRowVariant } from './types';

type RoutesListProps = {
  readonly routes?: ReadonlyArray<RouteTableRowFragment>;
  readonly areItemsSelectable?: boolean;
  readonly rowVariant: RouteLineTableRowVariant;
};

const testIds = {
  table: 'RoutesList::table',
};

export const RoutesList: FC<RoutesListProps> = ({
  routes,
  areItemsSelectable = false,
  rowVariant,
}) => (
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
