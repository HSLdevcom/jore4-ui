import { fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
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
        validity_start: DateTime.fromISO('2021-01-01T00:00:00+00:00'),
        validity_end: DateTime.fromISO('2023-12-13T00:00:00+00:00'),
        priority: 10,
        label: '65',
        __typename: 'route_line',
        line_routes: [
          {
            route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
            description_i18n: null,
            starts_from_scheduled_stop_point_id:
              'e3528755-711f-4e4f-9461-7931a2c4bc6d',
            ends_at_scheduled_stop_point_id:
              'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
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
            starts_from_scheduled_stop_point: {
              scheduled_stop_point_id: 'e3528755-711f-4e4f-9461-7931a2c4bc6d',
              label: 'pysäkki A',
              validity_start: DateTime.fromISO('2021-01-01T00:00:00+00:00'),
              validity_end: DateTime.fromISO('2023-12-13T00:00:00+00:00'),
              __typename: 'service_pattern_scheduled_stop_point',
            },
            ends_at_scheduled_stop_point: {
              scheduled_stop_point_id: 'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
              label: 'pysäkki C',
              validity_start: DateTime.fromISO('2021-01-01T00:00:00+00:00'),
              validity_end: DateTime.fromISO('2023-12-13T00:00:00+00:00'),
              __typename: 'service_pattern_scheduled_stop_point',
            },
            infrastructure_links_along_route: [
              {
                infrastructure_link: {
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      scheduled_stop_point_id:
                        'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                      label: 'pysäkki A',
                      validity_start: DateTime.fromISO(
                        '2021-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2023-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          scheduled_stop_point_id:
                            'e3528755-711f-4e4f-9461-7931a2c4bc6d',
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
                infrastructure_link: {
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      scheduled_stop_point_id:
                        '4d294d62-df17-46ff-9248-23f66f17fa87',
                      label: 'pysäkki B',
                      validity_start: DateTime.fromISO(
                        '2021-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2023-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          scheduled_stop_point_id:
                            '4d294d62-df17-46ff-9248-23f66f17fa87',
                          scheduled_stop_point_sequence: 1,
                          is_timing_point: true,
                          is_via_point: true,
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
                infrastructure_link: {
                  scheduled_stop_point_located_on_infrastructure_link: [
                    {
                      scheduled_stop_point_id:
                        'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                      label: 'pysäkki C',
                      validity_start: DateTime.fromISO(
                        '2021-01-01T00:00:00+00:00',
                      ),
                      validity_end: DateTime.fromISO(
                        '2023-12-13T00:00:00+00:00',
                      ),
                      __typename: 'service_pattern_scheduled_stop_point',
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          scheduled_stop_point_id:
                            'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
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

    // the stops should show when the accordion opens
    expect(container.querySelectorAll('tr')).toHaveLength(4);
    expect(asFragment()).toMatchSnapshot();
  });
});
