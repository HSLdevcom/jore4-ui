import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { DateTime } from 'luxon';
import { act } from 'react';
import {
  GetRouteDetailsByIdDocument,
  GetRouteDetailsByIdQuery,
  HslRouteTransportTargetEnum,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkExternalSourceEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { RouteDirection } from '../../../types/RouteDirection';
import { render, sleep } from '../../../utils/test-utils';
import { LineRouteList } from './LineRouteList';

describe(`<${LineRouteList.name} />`, () => {
  // These responses are copy-pasted from the actual graphql response.
  // The actual request for this is GET_ROUTE_DETAILS_BY_ID.
  const mocks: ReadonlyArray<
    MockedResponse & { result: { data: GetRouteDetailsByIdQuery } }
  > = [
    {
      request: {
        query: GetRouteDetailsByIdDocument,
        variables: {
          routeId: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
        },
      },
      result: {
        data: {
          route_route_by_pk: {
            validity_start: DateTime.fromISO('2000-01-01'),
            validity_end: DateTime.fromISO('2050-12-13'),
            priority: 10,
            __typename: 'route_route',
            label: '65x',
            direction: RouteDirectionEnum.Outbound,
            variant: null,
            route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
            name_i18n: { fi_FI: 'Reitti A - B FI', sv_FI: 'Reitti A - B SV' },
            description_i18n: {
              fi_FI: 'Reitti A - B desc FI',
              sv_FI: 'Reitti A - B desc SV',
            },
            origin_name_i18n: { fi_FI: 'A FI', sv_FI: 'A SV' },
            origin_short_name_i18n: {
              fi_FI: 'A short FI',
              sv_FI: 'A short SV',
            },
            destination_name_i18n: { fi_FI: 'B FI', sv_FI: 'B SV' },
            destination_short_name_i18n: {
              fi_FI: 'B short FI',
              sv_FI: 'B short SV',
            },
            on_line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
            route_shape: {
              type: 'LineString',
              coordinates: [
                [24.92743115932746, 60.16363353459729, 8.80899999999383],
                [24.929195905850854, 60.16425075458953, 8.62099999999919],
                [24.932010800782077, 60.16523749159016, 10.900999999998],
                [24.934523101958195, 60.16611826776014, 15.5639999999985],
              ],
            },
            route_line: {
              line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
              label: '65',
              name_i18n: {
                fi_FI: 'Rautatientori - Veräjälaakso FI',
                sv_FI: 'Rautatientori - Veräjälaakso SV',
              },
              short_name_i18n: {
                fi_FI: 'Rautatientori - Veräjälaakso short FI',
                sv_FI: 'Rautatientori - Veräjälaakso short SV',
              },
              validity_start: DateTime.fromISO('2000-01-01'),
              validity_end: DateTime.fromISO('2050-12-13'),
              priority: 10,
              __typename: 'route_line',
              primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
              type_of_line: RouteTypeOfLineEnum.RegionalBusService,
              transport_target:
                HslRouteTransportTargetEnum.HelsinkiInternalTraffic,
            },
            infrastructure_links_along_route: [
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_sequence: 0,
                infrastructure_link_id: 'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                infrastructure_link: {
                  external_link_id: '445117',
                  infrastructure_link_id:
                    'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                  shape: {
                    type: 'LineString',
                    coordinates: [
                      [24.92743115932746, 60.16363353459729, 8.80899999999383],
                      [24.929195905850854, 60.16425075458953, 8.62099999999919],
                    ],
                  },
                  direction: InfrastructureNetworkDirectionEnum.Bidirectional,
                  __typename: 'infrastructure_network_infrastructure_link',
                  external_link_source:
                    InfrastructureNetworkExternalSourceEnum.DigiroadR,
                  scheduled_stop_points_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      direction:
                        InfrastructureNetworkDirectionEnum.Bidirectional,
                      scheduled_stop_point_id:
                        'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                      label: 'H1234',
                      timing_place_id: 'd094b604-3860-4e2f-a601-9dad6f9827b9',
                      timing_place: {
                        timing_place_id: 'd094b604-3860-4e2f-a601-9dad6f9827b9',
                        label: '1KOSKS',
                      },
                      validity_start: DateTime.fromISO('2000-01-01'),
                      validity_end: DateTime.fromISO('2050-12-13'),
                      located_on_infrastructure_link_id:
                        'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                      __typename: 'service_pattern_scheduled_stop_point',
                      measured_location: {
                        type: 'Point',
                        coordinates: [24.928326557825727, 60.16391811339392, 0],
                      },
                      relative_distance_from_infrastructure_link_start: 0.4920981563179405,
                      closest_point_on_infrastructure_link: {
                        type: 'Point',
                        coordinates: [24.92829957953371, 60.16393727031912],
                      },
                      vehicle_mode_on_scheduled_stop_point: [
                        {
                          vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
                          __typename:
                            'service_pattern_vehicle_mode_on_scheduled_stop_point',
                        },
                      ],
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
                          scheduled_stop_point_label: 'H1234',
                          scheduled_stop_point_sequence: 0,
                          is_used_as_timing_point: false,
                          is_regulated_timing_point: false,
                          is_loading_time_allowed: false,
                          is_via_point: false,
                          via_point_name_i18n: null,
                          via_point_short_name_i18n: null,
                          journey_pattern: {
                            journey_pattern_id:
                              '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
                            on_route_id: 'adf05af2-5528-4149-a49b-cc83ea31bb58',
                            __typename: 'journey_pattern_journey_pattern',
                          },
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          scheduled_stop_point_label: 'H1234',
                          scheduled_stop_point_sequence: 0,
                          is_used_as_timing_point: false,
                          is_regulated_timing_point: false,
                          is_loading_time_allowed: false,
                          is_via_point: false,
                          via_point_name_i18n: null,
                          via_point_short_name_i18n: null,
                          journey_pattern: {
                            journey_pattern_id:
                              '43e1985d-4643-4415-8367-c4a37fbc0a87',
                            on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                            __typename: 'journey_pattern_journey_pattern',
                          },
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                      ],
                      other_label_instances: [
                        {
                          priority: 10,
                          direction:
                            InfrastructureNetworkDirectionEnum.Bidirectional,
                          scheduled_stop_point_id:
                            'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                          label: 'H1234',
                          timing_place_id:
                            'd094b604-3860-4e2f-a601-9dad6f9827b9',
                          timing_place: {
                            timing_place_id:
                              'd094b604-3860-4e2f-a601-9dad6f9827b9',
                            label: '1KOSKS',
                          },
                          validity_start: DateTime.fromISO('2000-01-01'),
                          validity_end: DateTime.fromISO('2050-12-13'),
                          located_on_infrastructure_link_id:
                            'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                          __typename: 'service_pattern_scheduled_stop_point',
                        },
                      ],
                    },
                  ],
                },
                is_traversal_forwards: true,
                __typename: 'route_infrastructure_link_along_route',
              },
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_sequence: 1,
                infrastructure_link_id: '2feba2ae-c7af-4034-a299-9e592e67358f',
                infrastructure_link: {
                  external_link_id: '442423',
                  infrastructure_link_id:
                    '2feba2ae-c7af-4034-a299-9e592e67358f',
                  shape: {
                    type: 'LineString',
                    coordinates: [
                      [24.929195905850854, 60.16425075458953, 8.62099999999919],
                      [24.932010800782077, 60.16523749159016, 10.900999999998],
                    ],
                  },
                  direction: InfrastructureNetworkDirectionEnum.Bidirectional,
                  __typename: 'infrastructure_network_infrastructure_link',
                  external_link_source:
                    InfrastructureNetworkExternalSourceEnum.DigiroadR,
                  scheduled_stop_points_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      direction:
                        InfrastructureNetworkDirectionEnum.Bidirectional,
                      scheduled_stop_point_id:
                        '4d294d62-df17-46ff-9248-23f66f17fa87',
                      label: 'H1235',
                      timing_place_id: '651a693b-b18b-4daa-a6da-c3677bfd2113',
                      timing_place: {
                        timing_place_id: '651a693b-b18b-4daa-a6da-c3677bfd2113',
                        label: '1OLK',
                      },
                      validity_start: DateTime.fromISO('2000-01-01'),
                      validity_end: DateTime.fromISO('2050-12-13'),
                      located_on_infrastructure_link_id:
                        '2feba2ae-c7af-4034-a299-9e592e67358f',
                      __typename: 'service_pattern_scheduled_stop_point',
                      measured_location: {
                        type: 'Point',
                        coordinates: [
                          24.930490150380855, 60.164635254660325, 0,
                        ],
                      },
                      relative_distance_from_infrastructure_link_start: 0.43657733896325085,
                      closest_point_on_infrastructure_link: {
                        type: 'Point',
                        coordinates: [24.930424804348895, 60.16468154886878],
                      },
                      vehicle_mode_on_scheduled_stop_point: [
                        {
                          vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
                          __typename:
                            'service_pattern_vehicle_mode_on_scheduled_stop_point',
                        },
                      ],
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
                          scheduled_stop_point_label: 'H1235',
                          scheduled_stop_point_sequence: 1,
                          is_used_as_timing_point: true,
                          is_regulated_timing_point: false,
                          is_loading_time_allowed: false,
                          is_via_point: true,
                          via_point_name_i18n: {
                            fi_FI: 'Paikka',
                            sv_FI: 'Plats',
                          },
                          via_point_short_name_i18n: {
                            fi_FI: 'Pai.',
                            sv_FI: 'Pla.',
                          },
                          journey_pattern: {
                            journey_pattern_id:
                              '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
                            on_route_id: 'adf05af2-5528-4149-a49b-cc83ea31bb58',
                            __typename: 'journey_pattern_journey_pattern',
                          },
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                      ],
                      other_label_instances: [
                        {
                          priority: 10,
                          direction:
                            InfrastructureNetworkDirectionEnum.Bidirectional,
                          scheduled_stop_point_id:
                            '4d294d62-df17-46ff-9248-23f66f17fa87',
                          label: 'H1235',
                          timing_place_id:
                            '651a693b-b18b-4daa-a6da-c3677bfd2113',
                          timing_place: {
                            timing_place_id:
                              '651a693b-b18b-4daa-a6da-c3677bfd2113',
                            label: '1OLK',
                          },
                          validity_start: DateTime.fromISO('2000-01-01'),
                          validity_end: DateTime.fromISO('2050-12-13'),
                          located_on_infrastructure_link_id:
                            '2feba2ae-c7af-4034-a299-9e592e67358f',
                          __typename: 'service_pattern_scheduled_stop_point',
                        },
                      ],
                    },
                  ],
                },
                is_traversal_forwards: true,
                __typename: 'route_infrastructure_link_along_route',
              },
              {
                route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                infrastructure_link_sequence: 2,
                infrastructure_link_id: 'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                infrastructure_link: {
                  external_link_id: '442027',
                  infrastructure_link_id:
                    'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                  shape: {
                    type: 'LineString',
                    coordinates: [
                      [24.932010800782077, 60.16523749159016, 10.900999999998],
                      [24.934523101958195, 60.16611826776014, 15.5639999999985],
                    ],
                  },
                  direction: InfrastructureNetworkDirectionEnum.Bidirectional,
                  __typename: 'infrastructure_network_infrastructure_link',
                  external_link_source:
                    InfrastructureNetworkExternalSourceEnum.DigiroadR,
                  scheduled_stop_points_located_on_infrastructure_link: [
                    {
                      priority: 10,
                      direction:
                        InfrastructureNetworkDirectionEnum.Bidirectional,
                      scheduled_stop_point_id:
                        'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                      label: 'H1236',
                      timing_place_id: '77dcdda2-bfc4-4aec-b24d-0dcff317857d',
                      timing_place: {
                        timing_place_id: '77dcdda2-bfc4-4aec-b24d-0dcff317857d',
                        label: '1ESIM',
                      },
                      validity_start: DateTime.fromISO('2000-01-01'),
                      validity_end: DateTime.fromISO('2050-12-13'),
                      located_on_infrastructure_link_id:
                        'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                      __typename: 'service_pattern_scheduled_stop_point',
                      measured_location: {
                        type: 'Point',
                        coordinates: [24.933251767757206, 60.16565505738068, 0],
                      },
                      relative_distance_from_infrastructure_link_start: 0.48738065747222575,
                      closest_point_on_infrastructure_link: {
                        type: 'Point',
                        coordinates: [24.933235230916978, 60.16566677073708],
                      },
                      vehicle_mode_on_scheduled_stop_point: [
                        {
                          vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
                          __typename:
                            'service_pattern_vehicle_mode_on_scheduled_stop_point',
                        },
                      ],
                      scheduled_stop_point_in_journey_patterns: [
                        {
                          journey_pattern_id:
                            '43e1985d-4643-4415-8367-c4a37fbc0a87',
                          scheduled_stop_point_label: 'H1236',
                          scheduled_stop_point_sequence: 1,
                          is_used_as_timing_point: false,
                          is_regulated_timing_point: false,
                          is_loading_time_allowed: false,
                          is_via_point: false,
                          via_point_name_i18n: null,
                          via_point_short_name_i18n: null,
                          journey_pattern: {
                            journey_pattern_id:
                              '43e1985d-4643-4415-8367-c4a37fbc0a87',
                            on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                            __typename: 'journey_pattern_journey_pattern',
                          },
                          __typename:
                            'journey_pattern_scheduled_stop_point_in_journey_pattern',
                        },
                      ],
                      other_label_instances: [
                        {
                          priority: 10,
                          direction:
                            InfrastructureNetworkDirectionEnum.Bidirectional,
                          scheduled_stop_point_id:
                            'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                          label: 'H1236',
                          timing_place_id:
                            '77dcdda2-bfc4-4aec-b24d-0dcff317857d',
                          timing_place: {
                            timing_place_id:
                              '77dcdda2-bfc4-4aec-b24d-0dcff317857d',
                            label: '1ESIM',
                          },
                          validity_start: DateTime.fromISO('2000-01-01'),
                          validity_end: DateTime.fromISO('2050-12-13'),
                          located_on_infrastructure_link_id:
                            'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                          __typename: 'service_pattern_scheduled_stop_point',
                        },
                      ],
                    },
                  ],
                },
                is_traversal_forwards: true,
                __typename: 'route_infrastructure_link_along_route',
              },
            ],
            route_journey_patterns: [
              {
                journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                ordered_scheduled_stop_point_in_journey_patterns: [
                  {
                    journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                    scheduled_stop_point_label: 'H1234',
                    scheduled_stop_point_sequence: 0,
                    is_used_as_timing_point: false,
                    is_regulated_timing_point: false,
                    is_loading_time_allowed: false,
                    is_via_point: false,
                    via_point_name_i18n: null,
                    via_point_short_name_i18n: null,
                    journey_pattern: {
                      journey_pattern_id:
                        '43e1985d-4643-4415-8367-c4a37fbc0a87',
                      on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                      __typename: 'journey_pattern_journey_pattern',
                    },
                    __typename:
                      'journey_pattern_scheduled_stop_point_in_journey_pattern',
                    scheduled_stop_points: [
                      {
                        priority: 10,
                        direction:
                          InfrastructureNetworkDirectionEnum.Bidirectional,
                        scheduled_stop_point_id:
                          'e3528755-711f-4e4f-9461-7931a2c4bc6d',
                        label: 'H1234',
                        timing_place_id: 'd094b604-3860-4e2f-a601-9dad6f9827b9',
                        timing_place: {
                          timing_place_id:
                            'd094b604-3860-4e2f-a601-9dad6f9827b9',
                          label: '1KOSKS',
                        },
                        validity_start: DateTime.fromISO('2000-01-01'),
                        validity_end: DateTime.fromISO('2050-12-13'),
                        located_on_infrastructure_link_id:
                          'c63b749f-5060-4710-8b07-ec9ac017cb5f',
                        __typename: 'service_pattern_scheduled_stop_point',
                      },
                    ],
                  },
                  {
                    journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
                    scheduled_stop_point_label: 'H1236',
                    scheduled_stop_point_sequence: 1,
                    is_used_as_timing_point: false,
                    is_regulated_timing_point: false,
                    is_loading_time_allowed: false,
                    is_via_point: false,
                    via_point_name_i18n: null,
                    via_point_short_name_i18n: null,
                    journey_pattern: {
                      journey_pattern_id:
                        '43e1985d-4643-4415-8367-c4a37fbc0a87',
                      on_route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
                      __typename: 'journey_pattern_journey_pattern',
                    },
                    __typename:
                      'journey_pattern_scheduled_stop_point_in_journey_pattern',
                    scheduled_stop_points: [
                      {
                        priority: 10,
                        direction:
                          InfrastructureNetworkDirectionEnum.Bidirectional,
                        scheduled_stop_point_id:
                          'f8eace87-7901-4438-bfee-bb6f24f1c4c4',
                        label: 'H1236',
                        timing_place_id: '651a693b-b18b-4daa-a6da-c3677bfd2113',
                        timing_place: {
                          timing_place_id:
                            '651a693b-b18b-4daa-a6da-c3677bfd2113',
                          label: '1ESIM',
                        },
                        validity_start: DateTime.fromISO('2000-01-01'),
                        validity_end: DateTime.fromISO('2050-12-13'),
                        located_on_infrastructure_link_id:
                          'd3ed9fcf-d1fa-419a-a279-7ad3ffe47714',
                        __typename: 'service_pattern_scheduled_stop_point',
                      },
                    ],
                  },
                ],
                __typename: 'journey_pattern_journey_pattern',
              },
            ],
          },
        },
      },
    },
  ];

  const routes = [
    {
      validity_start: DateTime.fromISO('2000-01-01'),
      validity_end: DateTime.fromISO('2050-12-13'),
      priority: 10,
      label: '65x',
      direction: RouteDirection.Outbound,
      variant: null,
      route_id: '03d55414-e5cf-4cce-9faf-d86ccb7e5f98',
    },
  ];

  test('Renders the route with stops along its geometry', async () => {
    const { container, asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineRouteList routes={routes} />
      </MockedProvider>,
    );

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // the stops don't show as the accordion is not open, 2 routes show
    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(asFragment()).toMatchSnapshot();

    const accordionButton = screen.getByTestId('RouteRow::toggleAccordion');
    fireEvent.click(accordionButton);

    // the stops on journey pattern should show when the accordion opens
    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(asFragment()).toMatchSnapshot();

    const showUnusedStopsToggle = screen.getByTestId(
      'LineRouteList::showUnusedStopsSwitch',
    );
    fireEvent.click(showUnusedStopsToggle);

    // all the stops should show when unused stops toggle has been clicked
    expect(container.querySelectorAll('li')).toHaveLength(4);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Generates links for stop details', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineRouteList routes={routes} />
      </MockedProvider>,
    );

    // wait for the graphql call to execute
    await act(() => sleep(0));

    const accordionButton = screen.getByTestId('RouteRow::toggleAccordion');
    fireEvent.click(accordionButton);

    const label = within(
      screen.getAllByTestId('RouteStopListItem::container')[0],
    ).getByTestId('RouteStopListItem::label');
    expect(label).toHaveTextContent('H1234');
    expect(label.title).toContain('H1234');
    expect(label).toHaveAttribute(
      'href',
      '/stop-registry/stops/H1234?observationDate=2017-02-14',
    );
  });
});
