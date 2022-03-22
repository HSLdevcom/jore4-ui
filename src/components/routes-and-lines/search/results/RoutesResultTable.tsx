import React from 'react';
import { RouteRoute } from '../../../../generated/graphql';
import { RoutesTable } from '../../../RoutesTable';
import { RoutesTableRow } from '../../../RoutesTableRow'; // eslint-disable-line import/no-cycle

export const RoutesResultTable = ({
  routes,
}: {
  routes: RouteRoute[] | undefined;
}) =>
  routes && routes.length > 0 ? (
    <RoutesTable>
      {routes?.map((item: RouteRoute) => (
        <RoutesTableRow key={item.route_id} route={item} />
      ))}
    </RoutesTable>
  ) : (
    <></>
  );
