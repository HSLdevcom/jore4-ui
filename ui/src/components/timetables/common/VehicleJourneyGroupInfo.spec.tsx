import { DateTime, Duration } from 'luxon';
import { VehicleJourneyWithServiceFragment } from '../../../generated/graphql';
import { TimetablePriority } from '../../../types/enums';
import { render } from '../../../utils/test-utils';
import { VehicleJourneyGroup } from '../vehicle-schedule-details/useGetRouteTimetables';
import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

describe(`<${VehicleJourneyGroupInfo.name} />`, () => {
  const baseVehicleJourney: VehicleJourneyWithServiceFragment = {
    vehicle_journey_id: '',
    journey_pattern_ref_id: '',
    journey_pattern_ref: {
      journey_pattern_id: '',
      journey_pattern_ref_id: '',
    },
    block: {
      block_id: '',
      vehicle_service: {
        vehicle_service_id: '',
        day_type_id: '',
        vehicle_schedule_frame: {
          vehicle_schedule_frame_id: '',
          priority: TimetablePriority.Standard,
          validity_start: DateTime.fromISO('2023-01-01'),
          validity_end: DateTime.fromISO('2023-05-31'),
          created_at: DateTime.fromISO('2023-01-01'),
        },
        day_type: {
          label: '',
          day_type_id: '',
          name_i18n: {},
        },
      },
      vehicle_service_id: '',
    },
    start_time: Duration.fromISO('PT08H'),
    end_time: Duration.fromISO('PT09H'),
    timetabled_passing_times: [],
  };

  const vehicleJourneyGroup: VehicleJourneyGroup = {
    vehicleScheduleFrameId: '9feedd34-7a62-4de1-ac2e-1b8bdd584c67',
    dayType: {
      day_type_id: '',
      label: '',
      name_i18n: {
        en_US: '',
        fi_FI: '',
        sv_FI: '',
      },
    },
    priority: TimetablePriority.Standard,
    validity: {
      validityStart: DateTime.fromISO('2023-01-01'),
      validityEnd: DateTime.fromISO('2023-05-31'),
    },
    vehicleJourneys: [
      {
        ...baseVehicleJourney,
        start_time: Duration.fromISO('PT08H10M'),
      },
      {
        ...baseVehicleJourney,
        start_time: Duration.fromISO('PT08H15M'),
      },
      {
        ...baseVehicleJourney,
        start_time: Duration.fromISO('PT08H20M'),
      },
    ],
  };

  test('Renders VehicleJourneyGroupInfo with imported timetable', async () => {
    const { getByText, getByTestId } = render(
      <VehicleJourneyGroupInfo
        vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
        vehicleScheduleFrameId={vehicleJourneyGroup.vehicleScheduleFrameId}
        validityStart={vehicleJourneyGroup.validity.validityStart}
        validityEnd={vehicleJourneyGroup.validity.validityEnd}
        dayTypeNameI18n={vehicleJourneyGroup.dayType.name_i18n}
      />,
    );

    expect(getByText('1.1.2023 - 31.5.2023')).toBeVisible();
    expect(getByText('3 lähtöä')).toBeVisible();
    expect(getByText('08:10 ... 08:20')).toBeVisible();
    expect(
      getByTestId('VehicleJourneyGroupInfo::changeValidityButton'),
    ).toBeEnabled();
  });

  test('Render VehicleJourneyGroupInfo with substitute timetable (no vsf id)', async () => {
    const { getByText, getByTestId } = render(
      <VehicleJourneyGroupInfo
        vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
        vehicleScheduleFrameId={null}
        validityStart={vehicleJourneyGroup.validity.validityStart}
        validityEnd={vehicleJourneyGroup.validity.validityEnd}
        dayTypeNameI18n={vehicleJourneyGroup.dayType.name_i18n}
      />,
    );

    expect(getByText('1.1.2023 - 31.5.2023')).toBeVisible();
    expect(getByText('3 lähtöä')).toBeVisible();
    expect(getByText('08:10 ... 08:20')).toBeVisible();
    expect(
      getByTestId('VehicleJourneyGroupInfo::changeValidityButton'),
    ).toBeDisabled();
  });
});
