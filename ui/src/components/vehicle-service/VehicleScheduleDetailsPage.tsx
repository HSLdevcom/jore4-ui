import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useGetVehicleJourneysQuery } from '../../generated/graphql';
import { Container } from '../../layoutComponents';
import { PageHeader } from '../routes-and-lines/common/PageHeader';
import { PassingTimesByStopTable } from './passing-times-by-stop';
import { VehicleServiceTable } from './vehicle-service-table';

const GQL_GET_VEHICLE_JOURNEYS = gql`
  query GetVehicleJourneys {
    timetables {
      timetables_vehicle_journey_vehicle_journey {
        ...vehicle_journey
      }
    }
  }
`;

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

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
      <Container className="space-y-10 pt-10">
        <VehicleServiceTable />
        <PassingTimesByStopTable vehicleJourneys={vehicleJourneys} />
      </Container>
    </div>
  );
};
