import { RouteLineTableRowVariant, RouteTableRow } from '..';
import { RouteTableRowFragment } from '../../../generated/graphql';
import { RoutesTable } from '../../routes-and-lines/main/RoutesTable';

type Props = {
  routes?: RouteTableRowFragment[];
  areItemsSelectable?: boolean;
  rowVariant: RouteLineTableRowVariant;
  selectedAlert?: unknown;
  setSelectedAlert: (selectedAlert: unknown | undefined) => void;
};

const testIds = {
  table: 'RoutesList::table',
};

export const RoutesList = ({
  routes,
  areItemsSelectable = false,
  rowVariant,
  selectedAlert,
  setSelectedAlert,
}: Props): JSX.Element => {
  return (
    <RoutesTable testId={testIds.table}>
      {routes?.map((item: RouteTableRowFragment) => (
        <RouteTableRow
          rowVariant={rowVariant}
          key={item.route_id}
          route={item}
          isSelectable={areItemsSelectable}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      ))}
    </RoutesTable>
  );
};
