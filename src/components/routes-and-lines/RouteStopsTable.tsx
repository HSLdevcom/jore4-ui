import React from 'react';
import { RouteRoute } from '../../generated/graphql';
import { RoutesTableRow } from '../RoutesTableRow'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  route: RouteRoute;
  testId?: string;
}

export const RouteStopsTable = ({
  className,
  route,
  testId,
}: Props): JSX.Element => {
  // TODO reusing another component to display route info; should be replaced with custom component
  return (
    <table className={`w-full ${className}`} data-testid={testId}>
      <tbody>
        <RoutesTableRow key={route.route_id} route={route} />
      </tbody>
    </table>
  );
};
