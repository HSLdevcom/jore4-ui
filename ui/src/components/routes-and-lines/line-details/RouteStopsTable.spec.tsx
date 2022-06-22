import { fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import { GetLineDetailsWithRoutesByIdQuery } from '../../../generated/graphql';
import {
  GqlQueryResult,
  mapLineDetailsWithRoutesResult,
} from '../../../graphql';
import { buildLocalizedString, render } from '../../../utils/test-utils';
import { RouteStopsTable } from './RouteStopsTable';

describe(`<${RouteStopsTable.name} />`, () => {
  const testId = 'routeStopsTable1';

  // this response is copy-pasted from the actual graphql response
  const mockResponse = {
    data: {
      route_line_by_pk: {
        line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
        name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
        short_name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
        primary_vehicle_mode: 'bus',
        type_of_line: 'regional_bus_service',
        transport_target: 'helsinki_internal_traffic',
        validity_start: DateTime.fromISO('2021-01-01T00:00:00+00:00'),
        validity_end: DateTime.fromISO('2023-12-13T00:00:00+00:00'),
        priority: 10,
        label: '65',
        __typename: 'route_line',
        line_routes: [
          {
            route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
            name_i18n: {
              fi_FI: 'Reitti A - B FI',
            },
            description_i18n: {
              fi_FI: 'Reitti A - B desc FI',
              sv_FI: 'Reitti A - B desc SV',
            },
            origin_name_i18n: {
              fi_FI: 'A FI',
              sv_FI: 'A SV',
            },
            origin_short_name_i18n: {
              fi_FI: 'A short FI',
              sv_FI: 'A short SV',
            },
            destination_name_i18n: {
              fi_FI: 'B FI',
              sv_FI: 'B SV',
            },
            destination_short_name_i18n: {
              fi_FI: 'B short FI',
              sv_FI: 'B short SV',
            },
            route_shape: {
              type: 'LineString',
              coordinates: [
                [24.927431159, 60.163633535, 8.809],
                [24.929195906, 60.164250755, 8.621],
                [24.932010801, 60.165237492, 10.901],
                [24.934523102, 60.166118268, 15.564],
              ],
            },
            on_line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
            validity_start: DateTime.fromISO('2021-01-01T00:00:00+00:00'),
            validity_end: DateTime.fromISO('2023-12-13T00:00:00+00:00'),
            priority: 10,
            label: '65 itään',
            direction: 'outbound',
            __typename: 'route_route',
            infrastructure_links_along_route: [
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_id: 'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                infrastructure_link_sequence: 0,
                infrastructure_link: {
                  infrastructure_link_id:
                    'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      scheduled_stop_point_id:
                        'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                      label: 'pysäkki A',
                      validity_start: DateTime.fromISO(
                        '2000-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2050-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          journey_pattern: {
                            on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                          },
                          scheduled_stop_point_label: 'pysäkki A',
                          scheduled_stop_point_sequence: 0,
                          is_timing_point: false,
                          is_via_point: false,
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                      ],
                    },
                  ],
                  __typename: 'infrastructure_network_infrastructure_link',
                },
                __typename: 'route_infrastructure_link_along_route',
              },
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_id: '2feba2ae-c7af-4034-a299-9e592e67358f',
                infrastructure_link_sequence: 0,
                infrastructure_link: {
                  infrastructure_link_id:
                    '2feba2ae-c7af-4034-a299-9e592e67358f',
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      scheduled_stop_point_id:
                        '4d294d62-df17-46ff-9248-23f66f17fa87',
                      label: 'pysäkki B',
                      validity_start: DateTime.fromISO(
                        '2000-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2050-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [],
                    },
                  ],
                  __typename: 'infrastructure_network_infrastructure_link',
                },
                __typename: 'route_infrastructure_link_along_route',
              },
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_id: 'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                infrastructure_link_sequence: 0,
                infrastructure_link: {
                  infrastructure_link_id:
                    'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      scheduled_stop_point_id:
                        'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                      label: 'pysäkki C',
                      validity_start: DateTime.fromISO(
                        '2000-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2050-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          journey_pattern: {
                            on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                          },
                          scheduled_stop_point_label: 'pysäkki C',
                          scheduled_stop_point_sequence: 2,
                          is_timing_point: false,
                          is_via_point: false,
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                      ],
                    },
                  ],
                  __typename: 'infrastructure_network_infrastructure_link',
                },
                __typename: 'route_infrastructure_link_along_route',
              },
            ],
          },
        ],
      },
    },
  } as GqlQueryResult<GetLineDetailsWithRoutesByIdQuery>;

  test('Renders the route with stops along its geometry', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const line = mapLineDetailsWithRoutesResult(mockResponse)!;
    const { container, asFragment } = render(
      <RouteStopsTable testId={testId} routes={line.line_routes} />,
    );

    // the stops don't show as the accordion is not open
    expect(container.querySelectorAll('tr')).toHaveLength(1);
    expect(asFragment()).toMatchSnapshot();

    const accordionButton = screen.getByTestId(
      'RouteStopsHeaderRow::toggleAccordion',
    );
    fireEvent.click(accordionButton);

    // the stops on journey pattern should show when the accordion opens
    expect(container.querySelectorAll('tr')).toHaveLength(3);
    expect(asFragment()).toMatchSnapshot();

    const showUnusedStopsToggle = screen.getByTestId(
      'show-unused-stops-switch',
    );
    fireEvent.click(showUnusedStopsToggle);

    // all the stops should show when unused stops toggle has been clicked
    expect(container.querySelectorAll('tr')).toHaveLength(4);
    expect(asFragment()).toMatchSnapshot();
  });
});
