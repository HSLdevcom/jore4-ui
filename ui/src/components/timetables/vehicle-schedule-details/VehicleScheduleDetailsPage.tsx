import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useGetVehicleJourneysQuery } from '../../../generated/graphql';
import { useGetLineDetails, useGetTimetables } from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { mapToShortDate } from '../../../time';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { PassingTimesByStopTable } from '../passing-times-by-stop';
import { VehicleServiceTable } from './vehicle-service-table';

const GQL_GET_VEHICLE_JOURNEYS = gql`
  query GetVehicleJourneys {
    timetables {
      timetables_vehicle_journey_vehicle_journey {
        ...vehicle_journey_by_stop
      }
    }
  }
`;

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const { timetables, vehicleServices } = useGetTimetables();
  const { line } = useGetLineDetails();

  const vehicleScheduleFrames = timetables
    ?.timetables_vehicle_schedule_vehicle_schedule_frame.length
    ? timetables?.timetables_vehicle_schedule_vehicle_schedule_frame
    : [];

  const validityStartDate =
    mapToShortDate(vehicleScheduleFrames[0]?.validity_start) || '';
  const validityEndDate =
    mapToShortDate(vehicleScheduleFrames[0]?.validity_end) || '';

  // Just get all vehicle journeys from back end as test data
  // TODO: Use PassingTimesByStopTable in the right place and fetch correct data
  const vehicleJourneysResult = useGetVehicleJourneysQuery();
  const vehicleJourneys =
    vehicleJourneysResult.data?.timetables
      ?.timetables_vehicle_journey_vehicle_journey || [];

  return (
    <div>
      <PageHeader>
        <h1>
          <i className="icon-bus-alt text-tweaked-brand" />
          {t('lines.line', { label: line?.label })}
        </h1>
      </PageHeader>
      <div className="mx-12 my-8">
        <div className="mb-8">
          <p className="text-base font-bold">
            {t('timetables.validityPeriodLabel')}
          </p>
          <h1>{`${validityStartDate} - ${validityEndDate}`}</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
          {(vehicleServices || []).map((item) => (
            <VehicleServiceTable
              priority={item.priority}
              dayType={item.dayType}
              key={`${item.priority}-${item.dayType.day_type_id}`}
              vehicleServices={item.vehicleServices}
            />
          ))}
        </div>
      </div>
      <Container className="space-y-10 pt-10">
        <PassingTimesByStopTable vehicleJourneys={vehicleJourneys} />
      </Container>
    </div>
  );
};
