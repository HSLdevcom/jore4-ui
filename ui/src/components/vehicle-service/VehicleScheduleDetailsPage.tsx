import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  TimetablesVehicleServiceVehicleService,
  useGetVehicleJourneysQuery,
} from '../../generated/graphql';
import { useGetTimetables } from '../../hooks';
import { mapTimetablesServiceCalendarDayTypeToUiName } from '../../i18n/uiNameMappings';
import { Container } from '../../layoutComponents';
import { PageHeader } from '../routes-and-lines/common/PageHeader';
import { PassingTimesByStopTable } from './passing-times-by-stop';
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

  const { timetables } = useGetTimetables();

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
          {t('lines.line', { label: '!1234' })}
        </h1>
      </PageHeader>
      <div className="mx-12 my-8 grid grid-cols-3 gap-x-8 gap-y-5">
        {timetables?.timetables_service_calendar_day_type.map((item) => (
          <VehicleServiceTable
            key={item.label}
            heading={mapTimetablesServiceCalendarDayTypeToUiName(item.label)}
            vehicleServices={
              // TODO: should avoud unsafe as casting, but have no idea how to
              // access correct type. Getting rid of this this may require
              // also changes to the typings in Table component itself
              item.vehicle_services as TimetablesVehicleServiceVehicleService[]
            }
          />
        ))}
      </div>
      <Container className="space-y-10 pt-10">
        <PassingTimesByStopTable vehicleJourneys={vehicleJourneys} />
      </Container>
    </div>
  );
};
