import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import {
  RouteLine,
  useGetVehicleJourneysQuery,
} from '../../../generated/graphql';
import {
  useGetLineDetails,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { FormColumn, FormRow, ObservationDateInput } from '../../forms/common';
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

/**
 *  Attaches the 'returnTo' url to query string. This is used to return to the
 *  same line timetable view from where we opened the versions page. This is
 *  needed because we need to use line label in the versions page rather than
 *  line id.
 */
const getVersionsUrlWithReturnToQueryString = (line: RouteLine) => {
  const versionsUrl = routeDetails[Path.lineTimetableVersions].getLink(
    line.label,
  );
  const returnToQueryString = qs.stringify({ returnTo: line.line_id });

  return `${versionsUrl}?${returnToQueryString}`;
};

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
        <FormRow mdColumns={2} className="mb-8">
          <ObservationDateInput
            value={observationDate}
            onChange={onDateChange}
          />
          <FormColumn className="items-end justify-end">
            {line && (
              <SimpleButton
                className="mt-auto"
                inverted
                href={getVersionsUrlWithReturnToQueryString(line)}
              >
                {t('timetables.showVersions')}
              </SimpleButton>
            )}
          </FormColumn>
        </FormRow>
        <VehicleRouteTimetables routes={line?.line_routes || []} />
      </div>
      <Container className="space-y-10 pt-10">
        <PassingTimesByStopTable vehicleJourneys={vehicleJourneys} />
      </Container>
    </div>
  );
};
