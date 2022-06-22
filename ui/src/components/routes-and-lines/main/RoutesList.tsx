import React from 'react';
import { RouteRoute } from '../../../generated/graphql';
import { RoutesTable } from './RoutesTable';
import { RoutesTableRow } from './RoutesTableRow';

type Props = {
  routes?: RouteRoute[];
};

export const RoutesList = ({ routes }: Props): JSX.Element => (
  <RoutesTable>
    {routes?.map((item: RouteRoute) => (
      <RoutesTableRow key={item.route_id} route={item} />
    ))}
  </RoutesTable>
);
