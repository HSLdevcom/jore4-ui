import uniqueId from 'lodash/uniqueId';
import { DateTime, Duration } from 'luxon';
import { FC, PropsWithChildren } from 'react';
import {
  InfrastructureNetworkDirectionEnum,
  PassingTimeByStopFragment,
  RouteDirectionEnum,
  RouteWithJourneyPatternStopsFragment,
  VehicleJourneyByStopFragment,
} from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks/redux';
import { setShowArrivalTimesAction } from '../../../redux/slices/timetable';
import {
  fireEvent,
  getAssertedElement,
  render,
} from '../../../utils/test-utils';
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

const createScheduleStopPointInstance = (timingPlaceLabel: string) => ({
  direction: InfrastructureNetworkDirectionEnum.Forward,
  label: '',
  located_on_infrastructure_link_id: '',
  priority: 0,
  scheduled_stop_point_id: '',
  timing_place: {
    label: timingPlaceLabel,
    timing_place_id: '',
  },
  validity_end: DateTime.fromISO('2051-01-01T00:00:00.000+02:00'),
  validity_start: DateTime.fromISO('1990-01-01T00:00:00.000+02:00'),
});

const createTimetabledPassingTime = ({
  label,
  passingTime,
  arrivalTime,
  departureTime,
}: {
  label: string;
  passingTime: Duration;
  arrivalTime?: Duration;
  departureTime?: Duration;
}): PassingTimeByStopFragment => {
  return {
    arrival_time: arrivalTime,
    departure_time: departureTime,
    passing_time: passingTime,
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

const createTimetabledPassingTimeWithStopPoint = ({
  label,
  timingPlaceLabel,
  passingTime,
  arrivalTime,
  departureTime,
}: {
  label: string;
  timingPlaceLabel: string;
  passingTime: Duration;
  arrivalTime?: Duration;
  departureTime?: Duration;
}) => {
  const timetabledPassingTime = createTimetabledPassingTime({
    label,
    passingTime,
    arrivalTime,
    departureTime,
  });

  const scheduledStopPointInstance =
    createScheduleStopPointInstance(timingPlaceLabel);

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
        createTimetabledPassingTimeWithStopPoint({
          label: 'H2210',
          timingPlaceLabel: '1ELIEL',
          passingTime: Duration.fromISO('PT9H37M'),
          arrivalTime: Duration.fromISO('PT9H37M'),
        }),
        createTimetabledPassingTimeWithStopPoint({
          label: 'H2210',
          timingPlaceLabel: '1ELIEL',
          passingTime: Duration.fromISO('PT9H42M'),
          arrivalTime: Duration.fromISO('PT9H42M'),
        }),
        createTimetabledPassingTime({
          label: 'H221',
          passingTime: Duration.fromISO('PT13H19M'),
          departureTime: Duration.fromISO('PT13H19M'),
        }),
        createTimetabledPassingTime({
          label: 'H221',
          passingTime: Duration.fromISO('PT13H25M'),
          departureTime: Duration.fromISO('PT13H25M'),
        }),
        createTimetabledPassingTime({
          label: 'H221',
          passingTime: Duration.fromISO('PT14H55M'),
          arrivalTime: Duration.fromISO('PT14H58M'),
          departureTime: Duration.fromISO('PT14H59M'),
        }),
        createTimetabledPassingTime({
          label: 'H221',
          passingTime: Duration.fromISO('PT14H25M'),
          departureTime: Duration.fromISO('PT14H25M'),
        }),
      ],
      vehicle_journey_id: '',
    },
  ];

  const route: RouteWithJourneyPatternStopsFragment = {
    name_i18n: {},
    origin_name_i18n: {},
    origin_short_name_i18n: {},
    destination_name_i18n: {},
    destination_short_name_i18n: {},
    on_line_id: '',
    label: '',
    direction: RouteDirectionEnum.Outbound,
    route_id: '',
    priority: 0,
    route_journey_patterns: [
      {
        journey_pattern_id: '',
        on_route_id: '',
        ordered_scheduled_stop_point_in_journey_patterns: [
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
          {
            is_loading_time_allowed: false,
            is_regulated_timing_point: false,
            is_used_as_timing_point: false,
            is_via_point: false,
            journey_pattern: {
              journey_pattern_id: '',
              on_route_id: '',
            },
            journey_pattern_id: '',
            scheduled_stop_point_label: 'H221',
            scheduled_stop_point_sequence: 2,
            scheduled_stop_points: [],
            via_point_name_i18n: null,
            via_point_short_name_i18n: null,
          },
        ],
      },
    ],
  };

  const DispatchSetShowArrivalTimesActionWrapper: FC<PropsWithChildren> = ({
    children,
  }) => {
    const dispatch = useAppDispatch();
    dispatch(setShowArrivalTimesAction(true));
    return children;
  };

  const selectors = {
    timeContainer:
      '[data-testid="PassingTimesByStopTableRowPassingTime::timeContainer"]',
    hour: '[data-testid="PassingTimesByStopTableRowPassingTime::hour"]',
    departureTime:
      '[data-testid="PassingTimesByStopTableRowPassingMinute::departureTime"]',
    arrivalTime:
      '[data-testid="PassingTimesByStopTableRowPassingMinute::arrivalTime"]',
    button: '[data-testid="PassingTimesByStopTableRowPassingMinute::button"]',
  };

  const shouldHaveCorrectLabelTexts = (
    row: HTMLElement,
    textContentToHave: ReadonlyArray<string>,
  ) => {
    const column = row.querySelector('td');
    textContentToHave.forEach((text) => expect(column).toHaveTextContent(text));
  };

  const shouldHaveCorrectHourText = (timeContainer: Element, hour: string) => {
    expect(timeContainer.querySelector(selectors.hour)).toHaveTextContent(hour);
  };

  const shouldHaveCorrectDepartureTimes = (
    timeContainer: Element,
    minutes: ReadonlyArray<string>,
  ) => {
    const departureTimes = timeContainer.querySelectorAll(
      selectors.departureTime,
    );
    expect(departureTimes).toHaveLength(minutes.length);
    departureTimes.forEach((departureTime, index) => {
      expect(departureTime).toHaveTextContent(minutes[index]);
    });
  };

  test('should render labels and times correctly', () => {
    const { getByTestId } = render(
      <DispatchSetShowArrivalTimesActionWrapper>
        <PassingTimesByStopTable
          vehicleJourneys={vehicleJourneys}
          route={route}
        />
      </DispatchSetShowArrivalTimesActionWrapper>,
    );

    const rowH2210 = getByTestId('PassingTimesByStopTableRow::H2210');
    shouldHaveCorrectLabelTexts(rowH2210, ['H2210', '1ELIEL']);

    const timeContainerH2210 = getAssertedElement(
      rowH2210.querySelector(selectors.timeContainer),
    );

    shouldHaveCorrectHourText(timeContainerH2210, '9');
    shouldHaveCorrectDepartureTimes(timeContainerH2210, ['37', '42']);

    const rowH221 = getByTestId('PassingTimesByStopTableRow::H221');

    shouldHaveCorrectLabelTexts(rowH221, ['H221', 'Interpoloitu']);

    const timeContainersH221 = rowH221.querySelectorAll(
      selectors.timeContainer,
    );

    shouldHaveCorrectHourText(timeContainersH221[0], '13');
    shouldHaveCorrectDepartureTimes(timeContainersH221[0], ['19', '25']);

    shouldHaveCorrectHourText(timeContainersH221[1], '14');
    shouldHaveCorrectDepartureTimes(timeContainersH221[1], ['25', '55']);

    const arrivalTimes = timeContainersH221[1].querySelectorAll(
      selectors.arrivalTime,
    );
    expect(arrivalTimes[0]).toHaveClass('hidden');

    expect(arrivalTimes[1]).not.toHaveClass('hidden');
    expect(arrivalTimes[1]).toHaveTextContent('58');
  });

  test('should open and close popup correctly', () => {
    const { getByText, getByTestId, queryByText } = render(
      <PassingTimesByStopTable
        vehicleJourneys={vehicleJourneys}
        route={route}
      />,
    );
    expect(queryByText('Matala telibussi')).toBeNull();

    const passingTimesByStopTableRow = getByTestId(
      'PassingTimesByStopTableRow::H2210',
    );

    const button = getAssertedElement(
      passingTimesByStopTableRow.querySelector(selectors.button),
    );
    fireEvent.click(button);

    expect(getByText('Matala telibussi')).toBeVisible();

    const closeButton = getByTestId('Popover::closeButton');
    fireEvent.click(closeButton);

    expect(queryByText('Matala telibussi')).toBeNull();
  });
});
