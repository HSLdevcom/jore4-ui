import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useGetVehicleJourneysQuery } from '../../../generated/graphql';
import {
  useGetLineDetails,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import { ObservationDateInput } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { PassingTimesByStopTable } from '../passing-times-by-stop';
import { VehicleRouteTimetables } from './VehicleRouteTimetables';

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

  const { line } = useGetLineDetails();

  // Just get all vehicle journeys from back end as test data
  // TODO: Use PassingTimesByStopTable in the right place and fetch correct data
  const vehicleJourneysResult = useGetVehicleJourneysQuery();
  const vehicleJourneys =
    vehicleJourneysResult.data?.timetables
      ?.timetables_vehicle_journey_vehicle_journey || [];

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();
  const onDateChange = (date: DateTime) => {
    setObservationDateToUrl(date);
  };

  return (
    <div>
      <PageHeader>
        <h1>
          <i className="icon-bus-alt text-tweaked-brand" />
          {t('lines.line', { label: line?.label })}
        </h1>
      </PageHeader>
      <div className="mx-12 my-8">
        <Row className="mb-8">
          <Column>
            <ObservationDateInput
              value={observationDate}
              onChange={onDateChange}
            />
          </Column>
        </Row>
        <VehicleRouteTimetables routes={line?.line_routes || []} />
      </div>
      <Container className="space-y-10 pt-10">
        <PassingTimesByStopTable vehicleJourneys={vehicleJourneys} />
      </Container>
    </div>
  );
};
