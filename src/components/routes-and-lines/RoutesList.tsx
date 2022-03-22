import React from 'react';
import { RouteRoute } from '../../generated/graphql';
import { Visible } from '../../layoutComponents';
import { RoutesTable } from '../RoutesTable';
import { RoutesTableRow } from '../RoutesTableRow'; // eslint-disable-line import/no-cycle

type Props = {
  routes?: RouteRoute[];
};

export const RoutesList = ({ routes }: Props): JSX.Element => (
  <Visible visible={!!routes?.length}>
    <RoutesTable>
      {routes?.map((item: RouteRoute) => (
        <RoutesTableRow key={item.route_id} route={item} />
      ))}
    </RoutesTable>
  </Visible>
);
