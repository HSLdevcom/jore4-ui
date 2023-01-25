import { VehicleJourneyWithRouteInfoFragment } from '../../../generated/graphql';
import { useToggle } from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import { mapDurationToShortTime } from '../../../time';
import { AccordionButton } from '../../../uiComponents';
import { getRouteLabelVariantText } from '../../../utils/route';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';

const testIds = {
  table: 'BlockVehicleJourneysTable::table',
  toggleShowTable: 'BlockVehicleJourneysTable::toggleShowTable',
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
}): JSX.Element => {
  const route =
    vehicleJourney.journey_pattern_ref.journey_pattern_instance
      ?.journey_pattern_route;

  // This should never happen as route info is fetched in the same query as the vehicle journey itself.
  // Do this to tell typescript that the route exists.
  if (!route) {
    // eslint-disable-next-line no-console
    console.error('No route found for vehicle journey!');
    return <></>;
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
      <Td>
        {vehicleJourney.start_time
          ? mapDurationToShortTime(vehicleJourney.start_time)
          : ''}
      </Td>
      <Td>
        {vehicleJourney.end_time
          ? mapDurationToShortTime(vehicleJourney.end_time)
          : ''}
      </Td>
    </tr>
  );
};

interface Props {
  vehicleJourneys: VehicleJourneyWithRouteInfoFragment[];
  title: string;
}

export const BlockVehicleJourneysTable = ({
  vehicleJourneys,
  title,
}: Props): JSX.Element => {
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <table
      className="border-brand-gray w-full border"
      data-testid={testIds.table}
    >
      <thead>
        <tr>
          <Th className="w-1/6 bg-brand py-2 px-6 text-left text-white">
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
                onToggle={toggleIsOpen}
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
