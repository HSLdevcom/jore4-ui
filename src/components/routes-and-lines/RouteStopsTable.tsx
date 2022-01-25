import React from 'react';
import { RouteRoute } from '../../generated/graphql';
import { RouteStopsSection } from './RouteStopsSection'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  routes: RouteRoute[];
  testId?: string;
}

export const RouteStopsTable = ({ className, routes, testId }: Props) => {
  return (
    // setting a fake "height: 1px" so that "height: 100%" would work for the table cells
    <table className={`h-1 w-full ${className}`} data-testid={testId}>
      {routes.map((item) => {
        return <RouteStopsSection key={item.route_id} route={item} />;
      })}
    </table>
  );
};
