import { FC } from 'react';
import { RouteTableRowFragment } from '../../../../generated/graphql';
import { useRouteContinuations } from '../../Utils';
import { RoutesTable } from './RoutesTable';
import { RouteTableRow } from './RouteTableRow';
import { RouteLineTableRowVariant } from './Types';

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
}) => {
  const hasContinuingVersion = useRouteContinuations(routes ?? []);

  return (
    <RoutesTable testId={testIds.table}>
      {routes?.map((item: RouteTableRowFragment) => (
        <RouteTableRow
          rowVariant={rowVariant}
          key={item.route_id}
          route={item}
          hasContinuingVersion={hasContinuingVersion(item)}
          isSelectable={areItemsSelectable}
        />
      ))}
    </RoutesTable>
  );
};
