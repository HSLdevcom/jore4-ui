import React from 'react';
import { RouteRoute } from '../generated/graphql';
import { RoutesTableRow } from './RoutesTableRow'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  routes: RouteRoute[];
  testId?: string;
}

export const RoutesTable = ({
  className,
  routes,
  testId,
}: Props): JSX.Element => {
  return (
    <table className={`w-full ${className}`} data-testid={testId}>
      <tbody>
        {routes.map((item: RouteRoute) => (
          <RoutesTableRow key={item.route_id} route={item} />
        ))}
      </tbody>
    </table>
  );
};
