import { useReducer } from 'react';
import { VehicleJourneyWithRouteInfoFragment } from '../../../generated/graphql';
import { Row, Visible } from '../../../layoutComponents';
import { mapDurationToShortTime } from '../../../time';
import { AccordionButton } from '../../../uiComponents';
import { getRouteLabelVariantText } from '../../../utils/route';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';

interface Props {
  vehicleJourneys: VehicleJourneyWithRouteInfoFragment[];
  title: string;
}

const testIds = {
  table: 'RouteVehicleJourneysTable::table',
  toggleShowTable: 'RouteVehicleJourneysTable::toggleShowTable',
};

const Td: React.FC = ({ children }) => (
  <td className="border border-light-grey px-5 py-2">{children}</td>
);

interface ThProps {
  className?: string;
  colSpan?: number;
}

const Th: React.FC<ThProps> = ({ children, colSpan = 1, className = '' }) => (
  <th className={`border border-light-grey ${className}`} colSpan={colSpan}>
    {children}
  </th>
);

const VehicleJourneyRow = ({
  vehicleJourney,
}: {
  vehicleJourney: VehicleJourneyWithRouteInfoFragment;
}) => {
  const route =
    vehicleJourney.journey_pattern_ref.journey_pattern_instance
      ?.journey_pattern_route;

  if (!route) {
    throw new Error('No route found for vehicle journey!');
  }

  return (
    <tr className="odd:bg-white">
      <Td>
        <Row className="items-center font-bold">
          <DirectionBadge
            direction={route.direction}
            className="mr-2 h-5 w-5 text-base"
          />
          {getRouteLabelVariantText(route)}
        </Row>
      </Td>
      <Td>{vehicleJourney.block.vehicle_service.day_type.name_i18n.fi_FI}</Td>
      <Td>{mapDurationToShortTime(vehicleJourney.start_time)}</Td>
      <Td>{mapDurationToShortTime(vehicleJourney.end_time)}</Td>
    </tr>
  );
};

export const BlockVehicleJourneysTable = ({
  vehicleJourneys,
  title,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useReducer((value) => !value, true);

  return (
    <table
      className="border-brand-gray w-full border"
      data-testid={testIds.table}
    >
      <thead>
        <tr>
          <Th className="w-64 bg-brand py-2 px-6 text-left text-white">
            {title}
          </Th>
          <Th
            className="border-l border-l-white bg-white py-2 px-4 text-left text-hsl-dark-80"
            colSpan={4}
          >
            <Row className="flex-1 items-center justify-between font-normal">
              <div>!Kalustotyyppi 3 - Normaalibussi</div>
              <AccordionButton
                testId={testIds.toggleShowTable}
                isOpen={isOpen}
                onToggle={setIsOpen}
                iconClassName="text-brand text-[50px]"
              />
            </Row>
          </Th>
        </tr>
      </thead>
      <Visible visible={isOpen}>
        <tbody>
          {vehicleJourneys.map((vehicleJourney) => (
            <VehicleJourneyRow
              key={vehicleJourney.vehicle_journey_id}
              vehicleJourney={vehicleJourney}
            />
          ))}
        </tbody>
      </Visible>
    </table>
  );
};
