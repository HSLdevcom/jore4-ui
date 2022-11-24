import { JourneyPatternInsertInput } from '../../types';
import { routes } from './routes';

export const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: 'b928b450-036e-4364-9d19-b54415519d34',
    on_route_id: routes[0].route_id,
  },
];
