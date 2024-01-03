import { VehicleJourneyInfo } from '../../../../hooks';
import { parseI18nField } from '../../../../i18n/utils';
import { mapDurationToShortTime, mapToShortDate } from '../../../../time';

interface Props {
  vehicleJourneyInfo: VehicleJourneyInfo;
}

export const VehicleJourneyRow = ({ vehicleJourneyInfo }: Props) => {
  return (
    <tr className="border odd:bg-white even:bg-hsl-neutral-blue [&>td]:border-light-grey [&>td]:px-8 [&>td]:py-2">
      <td className="border-r font-bold">{vehicleJourneyInfo.uniqueLabel}</td>
      <td className="border-r">
        {mapDurationToShortTime(vehicleJourneyInfo.startTime)}
      </td>
      <td className="border-r">
        {parseI18nField(vehicleJourneyInfo.dayTypeName)}
      </td>
      <td className="!pr-0">
        {mapToShortDate(vehicleJourneyInfo.validityStart)}
      </td>
      <td className="!px-2">&ndash;</td>
      <td className="border-r !pl-0">
        {mapToShortDate(vehicleJourneyInfo.validityEnd)}
      </td>
      <td className="border-r">{vehicleJourneyInfo.contractNumber}</td>
      <td>{/* Filler */}</td>
    </tr>
  );
};
