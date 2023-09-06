import uniqueId from 'lodash/uniqueId';
import { DateTime, Duration } from 'luxon';
import {
  InfrastructureNetworkDirectionEnum,
  PassingTimeByStopFragment,
  RouteDirectionEnum,
  RouteWithJourneyPatternStopsFragment,
  VehicleJourneyByStopFragment,
} from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks/redux';
import { setShowArrivalTimesAction } from '../../../redux/slices/timetable';
import { fireEvent, render } from '../../../utils/test-utils';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';

const vehicleJourney = (vehicleTypeName: string) => ({
  block: {
    block_id: '',
    vehicle_type: {
      description_i18n: {
        fi_FI: vehicleTypeName,
      },
      vehicle_type_id: '',
    },
  },
  vehicle_journey_id: '',
});

const createScheduleStopPointInstance = (label: string) => ({
  direction: InfrastructureNetworkDirectionEnum.Forward,
  label: '',
  located_on_infrastructure_link_id: '',
  priority: 10,
  scheduled_stop_point_id: '',
  timing_place: {
    label,
    timing_place_id: '',
  },
  validity_end: DateTime.fromISO('2051-01-01T00:00:00.000+02:00'),
  validity_start: DateTime.fromISO('1990-01-01T00:00:00.000+02:00'),
});

const createTimetabledPassingTime = (
  label: string,
  passingTime: string,
  arrivalTime?: string,
  departureTime?: string,
): PassingTimeByStopFragment => {
  return {
    arrival_time: arrivalTime ? Duration.fromISO(arrivalTime) : null,
    departure_time: departureTime ? Duration.fromISO(departureTime) : null,
    passing_time: Duration.fromISO(passingTime),
    scheduled_stop_point_in_journey_pattern_ref: {
      journey_pattern_ref: {
        journey_pattern_ref_id: '',
        observation_timestamp: DateTime.fromISO('2022-12-31T22:00:00+00:00'),
      },
      scheduled_stop_point_in_journey_pattern_ref_id: '',
      scheduled_stop_point_instances: [],
      scheduled_stop_point_label: label,
    },
    scheduled_stop_point_in_journey_pattern_ref_id: '',
    timetabled_passing_time_id: uniqueId(),
    vehicle_journey: vehicleJourney('Matala telibussi'),
    vehicle_journey_id: uniqueId(),
  };
};

const createTimetabledPassingTimeWithStopPoint = (
  label: string,
  passingTime: string,
  arrivalTime?: string,
  departureTime?: string,
) => {
  const timetabledPassingTime = createTimetabledPassingTime(
    label,
    passingTime,
    arrivalTime,
    departureTime,
  );
  const scheduledStopPointInstance = createScheduleStopPointInstance(label);

  return {
    ...timetabledPassingTime,
    scheduled_stop_point_in_journey_pattern_ref: {
      ...timetabledPassingTime.scheduled_stop_point_in_journey_pattern_ref,
      scheduled_stop_point_instances: [scheduledStopPointInstance],
    },
  };
};

describe(`<${PassingTimesByStopTable.name} />`, () => {
  const vehicleJourneys: VehicleJourneyByStopFragment[] = [
    {
      journey_pattern_ref_id: '',
      timetabled_passing_times: [
        createTimetabledPassingTimeWithStopPoint('H2210', 'PT9H37M', 'PT9H37M'),
        createTimetabledPassingTimeWithStopPoint('H2210', 'PT9H42M', 'PT9H42M'),
        createTimetabledPassingTime('H221', 'PT13H19M', undefined, 'PT13H19M'),
        createTimetabledPassingTime('H221', 'PT13H25M', undefined, 'PT13H25M'),
        createTimetabledPassingTime('H221', 'PT14H55M', 'PT14H58M', 'PT14H59M'),
        createTimetabledPassingTime('H221', 'PT14H25M', undefined, 'PT14H25M'),
      ],
      vehicle_journey_id: '',
    },
  ];

  const route: RouteWithJourneyPatternStopsFragment = {
    name_i18n: {
      fi_FI: undefined,
      sv_FI: undefined,
    },
    origin_name_i18n: {
      fi_FI: undefined,
      sv_FI: undefined,
    },
    origin_short_name_i18n: {
      fi_FI: undefined,
      sv_FI: undefined,
    },
    destination_name_i18n: {
      fi_FI: undefined,
      sv_FI: undefined,
    },
    destination_short_name_i18n: {
      fi_FI: undefined,
      sv_FI: undefined,
    },
    on_line_id: '',
    label: '',
    direction: RouteDirectionEnum.Outbound,
    route_id: '',
    priority: 0,
    route_journey_patterns: [
      {
        journey_pattern_id: '',
        on_route_id: '',
        scheduled_stop_point_in_journey_patterns: [
          {
            is_loading_time_allowed: false,
            is_regulated_timing_point: false,
            is_used_as_timing_point: true,
            is_via_point: false,
            journey_pattern: {
              journey_pattern_id: '',
              on_route_id: '',
            },
            journey_pattern_id: '',
            scheduled_stop_point_label: 'H2210',
            scheduled_stop_point_sequence: 1,
            scheduled_stop_points: [],
            via_point_name_i18n: null,
            via_point_short_name_i18n: null,
          },
        ],
      },
    ],
  };

  const DispatchSetShowArrivalTimesActionWrapper = ({
    children,
  }: {
    children: JSX.Element;
  }) => {
    const dispatch = useAppDispatch();
    dispatch(setShowArrivalTimesAction(true));
    return children;
  };

  test('should render the arrival and departure times correctly', () => {
    const { getByText, getAllByText } = render(
      <DispatchSetShowArrivalTimesActionWrapper>
        <PassingTimesByStopTable
          vehicleJourneys={vehicleJourneys}
          route={route}
        />
      </DispatchSetShowArrivalTimesActionWrapper>,
    );
    // Each stops label is shown
    expect(getByText('H221')).toBeVisible();
    // Should show twice because it is used as timing point
    expect(getAllByText('H2210')).toHaveLength(2);

    // Hours shown correctly
    expect(getByText('9')).toBeVisible();
    expect(getByText('13')).toBeVisible();
    expect(getByText('14')).toBeVisible();
    // arrival minutes
    expect(getByText('58')).toBeVisible();
    // departure minutes
    expect(getByText('55')).toBeVisible();

    expect(getByText('Interpoloitu')).toBeVisible();
  });

  test('should open and close popup correctly', () => {
    const { getByText, getByTestId, queryByText } = render(
      <PassingTimesByStopTable
        vehicleJourneys={vehicleJourneys}
        route={route}
      />,
    );
    // Only visible after passing minute is clicked
    expect(queryByText('Matala telibussi')).toBeNull();

    const passingTimesByStopTableRow = getByTestId(
      'PassingTimesByStopTableRow::H2210',
    );

    const button = passingTimesByStopTableRow.querySelectorAll(
      'td:nth-child(2) > span > span:nth-child(2) > button',
    )[0];

    fireEvent.click(button);

    expect(getByText('Matala telibussi')).toBeVisible();

    const closeButton = getByTestId('Popover::closeButton');
    fireEvent.click(closeButton);

    expect(queryByText('Matala telibussi')).toBeNull();
  });
});
