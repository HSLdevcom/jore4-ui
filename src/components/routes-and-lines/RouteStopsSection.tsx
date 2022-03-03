import React, { useState } from 'react';
import { RouteRoute } from '../../generated/graphql';
import { getStopsAlongRouteGeometry } from '../../graphql';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow'; // eslint-disable-line import/no-cycle
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  route: RouteRoute;
}

export const RouteStopsSection = ({ className, route }: Props) => {
  const [isOpen, setOpen] = useState(false);

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const stopsAlongRoute = getStopsAlongRouteGeometry(route);

  return (
    <tbody className={className}>
      <RouteStopsHeaderRow
        key={route.route_id}
        route={route}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {isOpen &&
        stopsAlongRoute.map((item) => (
          <RouteStopsRow
            key={item.scheduled_stop_point_id}
            stop={item}
            routeId={route.route_id}
          />
        ))}
    </tbody>
  );
};
