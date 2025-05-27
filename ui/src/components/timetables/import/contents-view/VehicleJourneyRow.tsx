import { FC } from 'react';
import {
  VehicleJourneyWithRouteInfoFragment,
  VehicleServiceWithJourneysFragment,
} from '../../../../generated/graphql';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { Row } from '../../../../layoutComponents';
import { mapDurationToShortTime } from '../../../../time';
import { getRouteLabelVariantText } from '../../../../utils';
import { DirectionBadge } from '../../../routes-and-lines/line-details/DirectionBadge';

const testIds = {
  vehicleJourneyRow: 'VehicleJourneyRow',
  label: 'VehicleJourneyRow::label',
  dayTypeName: 'VehicleJourneyRow::dayTypeName',
  startTime: 'VehicleJourneyRow::startTime',
  endTime: 'VehicleJourneyRow::endTime',
  contractNumber: 'VehicleJourneyRow::contractNumber',
};
export const vehicleJourneyRowTestIds = testIds;

type VehicleJourneyRowProps = {
  readonly vehicleJourney: VehicleJourneyWithRouteInfoFragment;
  readonly vehicleService: VehicleServiceWithJourneysFragment;
};

export const VehicleJourneyRow: FC<VehicleJourneyRowProps> = ({
  vehicleJourney,
  vehicleService,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

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
      className="even:bg-white [&>td]:border [&>td]:border-light-grey [&>td]:px-5 [&>td]:py-2"
      data-testid={testIds.vehicleJourneyRow}
    >
      <td>
        <Row className="items-center font-bold">
          <DirectionBadge
            direction={route.direction}
            className="mr-2 h-5 w-5 text-base"
          />
          <span data-testid={testIds.label}>
            {getRouteLabelVariantText(route)}
          </span>
        </Row>
      </td>
      <td data-testid={testIds.dayTypeName}>
        {getLocalizedTextFromDbBlob(vehicleService.day_type.name_i18n)}
      </td>
      <td data-testid={testIds.startTime}>
        {vehicleJourney.start_time
          ? mapDurationToShortTime(vehicleJourney.start_time)
          : ''}
      </td>
      <td data-testid={testIds.endTime}>
        {vehicleJourney.end_time
          ? mapDurationToShortTime(vehicleJourney.end_time)
          : ''}
      </td>
      <td data-testid={testIds.contractNumber}>
        {vehicleJourney.contract_number}
      </td>
    </tr>
  );
};
