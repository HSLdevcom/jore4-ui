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
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <table
      className="border-brand-gray w-full border"
      data-testid={testIds.table}
    >
      <thead>
        <tr className="[&>th]:border [&>th]:border-light-grey">
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
