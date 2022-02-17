import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useGetLineDetailsWithRoutesByIdQuery } from '../../generated/graphql';
import { mapLineDetailsWithRoutesResult } from '../../graphql';
import { render } from '../../utils/test-utils';
import { RouteStopsTable } from './RouteStopsTable';

describe(`<${RouteStopsTable.name} />`, () => {
  const testId = 'routeStopsTable1';

  // this response is copy-pasted from the actual graphql response
  const mockResponse = {
    data: {
      route_line_by_pk: {
        line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
        name_i18n: 'Rautatientori - Veräjälaakso',
        short_name_i18n: 'Rautatientori - Veräjälaakso',
        description_i18n: 'Rautatientori - Kätilöopisto - Veräjälaakso',
        primary_vehicle_mode: 'bus',
        validity_start: '2021-01-01T00:00:00+00:00',
        validity_end: '2023-12-13T00:00:00+00:00',
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
            validity_start: '2021-01-01T00:00:00+00:00',
            validity_end: '2023-12-13T00:00:00+00:00',
            priority: 10,
            label: '65 itään',
            direction: 'outbound',
            __typename: 'route_route',
            starts_from_scheduled_stop_point: {
              scheduled_stop_point_id: 'e3528755-711f-4e4f-9461-7931a2c4bc6d',
              label: 'pysäkki A',
              validity_start: '2021-01-01T00:00:00+00:00',
              validity_end: '2023-12-13T00:00:00+00:00',
              __typename: 'service_pattern_scheduled_stop_point',
            },
            ends_at_scheduled_stop_point: {
              scheduled_stop_point_id: 'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
              label: 'pysäkki B',
              validity_start: '2021-01-01T00:00:00+00:00',
              validity_end: '2023-12-13T00:00:00+00:00',
              __typename: 'service_pattern_scheduled_stop_point',
            },
            route_journey_patterns: [
              {
                journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                scheduled_stop_point_in_journey_patterns: [
                  {
                    journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                    scheduled_stop_point_id:
                      'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                    scheduled_stop_point_sequence: 0,
                    is_timing_point: false,
                    is_via_point: true,
                    __typename:
                      'journey_pattern_scheduled_stop_point_in_journey_pattern',
                    scheduled_stop_point: {
                      scheduled_stop_point_id:
                        'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                      label: 'pysäkki A',
                      validity_start: '2021-01-01T00:00:00+00:00',
                      validity_end: '2023-12-13T00:00:00+00:00',
                      __typename: 'service_pattern_scheduled_stop_point',
                    },
                  },
                  {
                    journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                    scheduled_stop_point_id:
                      'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                    scheduled_stop_point_sequence: 1,
                    is_timing_point: true,
                    is_via_point: false,
                    __typename:
                      'journey_pattern_scheduled_stop_point_in_journey_pattern',
                    scheduled_stop_point: {
                      scheduled_stop_point_id:
                        'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                      label: 'pysäkki B',
                      validity_start: '2021-01-01T00:00:00+00:00',
                      validity_end: '2023-12-13T00:00:00+00:00',
                      __typename: 'service_pattern_scheduled_stop_point',
                    },
                  },
                ],
                __typename: 'journey_pattern_journey_pattern',
              },
            ],
          },
        ],
      },
    },
  } as ReturnType<typeof useGetLineDetailsWithRoutesByIdQuery>;

  test('Renders the route with stops in case it has journery pattern', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const line = mapLineDetailsWithRoutesResult(mockResponse)!;
    const { container, asFragment } = render(
      <BrowserRouter>
        <RouteStopsTable testId={testId} routes={line.line_routes} />
      </BrowserRouter>,
    );

    // the stops don't show as the accordion is not open
    expect(container.querySelectorAll('tr')).toHaveLength(1);

    const accordionButton = screen.getByTestId(
      'RouteStopsHeaderRow::toggleAccordion',
    );
    fireEvent.click(accordionButton);

    // the stops should show when the accordion opens
    expect(container.querySelectorAll('tr')).toHaveLength(3);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders the route without stops in case it does not have a journery pattern', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const line = mapLineDetailsWithRoutesResult(mockResponse)!;

    // removing journery pattern
    line.line_routes[0].route_journey_patterns = [];

    const { container, asFragment } = render(
      <BrowserRouter>
        <RouteStopsTable testId={testId} routes={line.line_routes} />
      </BrowserRouter>,
    );

    // the stops don't show as the accordion is not open
    expect(container.querySelectorAll('tr')).toHaveLength(1);

    const accordionButton = screen.getByTestId(
      'RouteStopsHeaderRow::toggleAccordion',
    );
    fireEvent.click(accordionButton);

    // there are no stops show even after the accordion is opened
    expect(container.querySelectorAll('tr')).toHaveLength(1);
    expect(asFragment()).toMatchSnapshot();
  });
});
