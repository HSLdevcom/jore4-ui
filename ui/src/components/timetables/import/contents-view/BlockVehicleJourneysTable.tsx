import { useTranslation } from 'react-i18next';
import {
  VehicleJourneyWithRouteInfoFragment,
  VehicleServiceWithJourneysFragment,
} from '../../../../generated/graphql';
import { useToggle } from '../../../../hooks';
import { Row, Visible } from '../../../../layoutComponents';
import { AccordionButton } from '../../../../uiComponents';
import { VehicleJourneyRow } from './VehicleJourneyRow';

const testIds = {
  table: 'BlockVehicleJourneysTable::table',
  title: 'BlockVehicleJourneysTable::title',
  toggleShowTable: 'BlockVehicleJourneysTable::toggleShowTable',
  vehicleType: 'BlockVehicleJourneysTable::vehicleType',
  vehicleJourneyHeaders: 'BlockVehicleJourneysTable::vehicleJourneyHeaders',
};
export const blockVehicleJourneysTableTestIds = testIds;

interface Props {
  vehicleJourneys: VehicleJourneyWithRouteInfoFragment[];
  vehicleService: VehicleServiceWithJourneysFragment;
  vehicleType: string;
  title: string;
}

export const BlockVehicleJourneysTable = ({
  vehicleJourneys,
  vehicleService,
  vehicleType,
  title,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <table
      className="border-brand-gray w-full border"
      data-testid={testIds.table}
    >
      <thead className="[&>tr>th]:border [&>tr>th]:border-light-grey">
        <tr>
          <th
            data-testid={testIds.title}
            className="w-1/6 bg-brand py-2 px-6 text-left text-white"
          >
            {title}
          </th>
          <th
            className="border-l border-l-white bg-white py-2 px-4 text-left text-hsl-dark-80"
            colSpan={4}
          >
            <Row className="flex-1 items-center justify-between font-normal">
              <p data-testid={testIds.vehicleType}>{vehicleType}</p>
              <AccordionButton
                testId={testIds.toggleShowTable}
                isOpen={isOpen}
                onToggle={toggleIsOpen}
                iconClassName="text-brand text-[50px]"
              />
            </Row>
          </th>
        </tr>
        {isOpen && (
          <tr
            className="bg-white [&>th]:px-5 [&>th]:py-2 [&>th]:text-left [&>th]:font-normal"
            data-testid={testIds.vehicleJourneyHeaders}
          >
            <th>{t('timetablesPreview.tableHeaders.routeLabel')}</th>
            <th>{t('timetablesPreview.tableHeaders.dayType')}</th>
            <th>{t('timetablesPreview.tableHeaders.departureTime')}</th>
            <th>{t('timetablesPreview.tableHeaders.endTime')}</th>
            <th>{t('timetablesPreview.tableHeaders.contractNumber')}</th>
          </tr>
        )}
      </thead>
      <Visible visible={isOpen}>
        <tbody>
          {vehicleJourneys.map((vehicleJourney) => (
            <VehicleJourneyRow
              key={vehicleJourney.vehicle_journey_id}
              vehicleJourney={vehicleJourney}
              vehicleService={vehicleService}
            />
          ))}
        </tbody>
      </Visible>
    </table>
  );
};
