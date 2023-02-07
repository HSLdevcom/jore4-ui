import { DateTime } from 'luxon';
import { buildRoute } from '../../builders';
import {
  RouteDirectionEnum,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteRouteInsertInput,
} from '../../generated/graphql';
import { Priority } from '../../types';
import { infrastructureLinks } from './infrastructureLinks';
import { lines } from './lines';

export const routes: RouteRouteInsertInput[] = [
  {
    ...buildRoute({ label: '1' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[0].line_id,
    direction: RouteDirectionEnum.Northbound,
    priority: Priority.Standard,
    validity_start: DateTime.fromISO('2044-05-02 23:11:32Z'),
    validity_end: null,
  },
  {
    ...buildRoute({ label: '2' }),
    route_id: '91994146-0569-44be-b2f1-da3c073d416c',
    on_line_id: lines[1].line_id,
    direction: RouteDirectionEnum.Southbound,
    priority: Priority.Temporary,
    validity_start: DateTime.fromISO('2044-06-02 23:11:32Z'),
    validity_end: DateTime.fromISO('2045-04-02 23:11:32Z'),
  },
];

export const infrastructureLinkAlongRoute: RouteInfrastructureLinkAlongRouteInsertInput[] =
  [
    {
      route_id: routes[0].route_id,
      infrastructure_link_id: infrastructureLinks[0].infrastructure_link_id,
      infrastructure_link_sequence: 0,
      is_traversal_forwards: false,
    },
    {
      route_id: routes[0].route_id,
      infrastructure_link_id: infrastructureLinks[1].infrastructure_link_id,
      infrastructure_link_sequence: 1,
      is_traversal_forwards: false,
    },
    {
      route_id: routes[0].route_id,
      infrastructure_link_id: infrastructureLinks[2].infrastructure_link_id,
      infrastructure_link_sequence: 3,
      is_traversal_forwards: true,
    },
  ];
