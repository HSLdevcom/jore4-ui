import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { RoutesTable } from './RoutesTable';
import { RoutesTableRow } from './RoutesTableRow';

type Props = {
  routes?: RouteAllFieldsFragment[];
};

export const RoutesList = ({ routes }: Props): JSX.Element => (
  <RoutesTable>
    {routes?.map((item: RouteAllFieldsFragment) => (
      <RoutesTableRow key={item.route_id} route={item} />
    ))}
  </RoutesTable>
);
