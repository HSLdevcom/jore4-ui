import { useTranslation } from 'react-i18next';
import { VehicleJourneyWithRouteInfoFragment } from '../../../generated/graphql';
import { useToggle } from '../../../hooks';
import { parseI18nField } from '../../../i18n/utils';
import { Row, Visible } from '../../../layoutComponents';
import { mapDurationToShortTime } from '../../../time';
import { AccordionButton } from '../../../uiComponents';
import { getRouteLabelVariantText } from '../../../utils/route';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';

const testIds = {
  table: 'BlockVehicleJourneysTable::table',
  toggleShowTable: 'BlockVehicleJourneysTable::toggleShowTable',
  vehicleJourneyRow: (routeLabel: string, routeDirection: string) =>
    `BlockVehicleJourneysTable::vehicleJourneyRow::${routeLabel}::${routeDirection}`,
};

const VehicleJourneyRow = ({
  vehicleJourney,
}: {
  vehicleJourney: VehicleJourneyWithRouteInfoFragment;
}): JSX.Element => {
  const { t } = useTranslation();
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
    <tr
      className="odd:bg-white [&>td]:border [&>td]:border-light-grey [&>td]:px-5 [&>td]:py-2"
      data-testid={testIds.vehicleJourneyRow(route.label, route.direction)}
    >
      <td>
        <Row className="items-center font-bold">
          <DirectionBadge
            direction={route.direction}
            className="mr-2 h-5 w-5 text-base"
            titleName={t(`directionEnum.${route.direction}`)}
          />
          {getRouteLabelVariantText(route)}
        </Row>
      </td>
      <td>
        {parseI18nField(
          vehicleJourney.block.vehicle_service.day_type.name_i18n,
        )}
      </td>
      <td>
        {vehicleJourney.start_time
          ? mapDurationToShortTime(vehicleJourney.start_time)
          : ''}
      </td>
      <td>
        {vehicleJourney.end_time
          ? mapDurationToShortTime(vehicleJourney.end_time)
          : ''}
      </td>
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
        <tr className="[&>th]:border [&>th]:border-light-grey">
          <th className="w-1/6 bg-brand py-2 px-6 text-left text-white">
            {title}
          </th>
          <th
            className="border-l border-l-white bg-white py-2 px-4 text-left text-hsl-dark-80"
            colSpan={4}
          >
            <Row className="flex-1 items-center justify-between font-normal">
              <p>!Kalustotyyppi 3 - Normaalibussi</p>
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
            />
          ))}
        </tbody>
      </Visible>
    </table>
  );
};
