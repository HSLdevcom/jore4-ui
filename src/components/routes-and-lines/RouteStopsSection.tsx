import React, { useState } from 'react';
import { RouteRoute } from '../../generated/graphql';
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

  // TODO handle multiple journey patterns when the UI design supports it
  // note: a route might not have a journey pattern at all in the data model
  const journeyPattern = route.route_journey_patterns[0];

  return (
    <tbody className={className}>
      <RouteStopsHeaderRow
        key={route.route_id}
        route={route}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {journeyPattern &&
        isOpen &&
        journeyPattern.scheduled_stop_point_in_journey_patterns?.map((item) => (
          <RouteStopsRow key={item.scheduled_stop_point_id} stop={item} />
        ))}
    </tbody>
  );
};
