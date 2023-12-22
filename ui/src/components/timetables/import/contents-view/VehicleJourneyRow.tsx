import { useTranslation } from 'react-i18next';
import { VehicleJourneyWithRouteInfoFragment } from '../../../../generated/graphql';
import { parseI18nField } from '../../../../i18n/utils';
import { Row } from '../../../../layoutComponents';
import { mapDurationToShortTime } from '../../../../time';
import { getRouteLabelVariantText } from '../../../../utils';
import { DirectionBadge } from '../../../routes-and-lines/line-details/DirectionBadge';

const testIds = {
  vehicleJourneyRow: (routeLabel: string, routeDirection: string) =>
    `VehicleJourneyRow::${routeLabel}::${routeDirection}`,
};

export const VehicleJourneyRow = ({
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
      <td>{vehicleJourney.contract_number}</td>
    </tr>
  );
};
