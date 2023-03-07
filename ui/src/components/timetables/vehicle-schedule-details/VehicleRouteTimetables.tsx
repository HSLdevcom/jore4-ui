import { RouteWithJourneyPatternStopsFragment } from '../../../generated/graphql';
import { VehicleRouteTimetableSection } from './VehicleRouteTimetableSection';

interface Props {
  routes: RouteWithJourneyPatternStopsFragment[];
}

export const VehicleRouteTimetables = ({ routes }: Props): JSX.Element => {
  return (
    <div className="grid gap-y-5">
      {routes.map((item, index) => (
        <VehicleRouteTimetableSection
          key={item.route_id}
          route={item}
          initiallyOpen={index === 0}
        />
      ))}
    </div>
  );
};
