import { FC } from 'react';
import { VehicleJourneyInfo } from '../../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { mapDurationToShortTime, mapToShortDate } from '../../../../time';

type VehicleJourneyRowProps = {
  readonly vehicleJourneyInfo: VehicleJourneyInfo;
};

export const VehicleJourneyRow: FC<VehicleJourneyRowProps> = ({
  vehicleJourneyInfo,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  return (
    <tr className="border odd:bg-white even:bg-hsl-neutral-blue [&>td]:border-light-grey [&>td]:px-8 [&>td]:py-2">
      <td className="border-r font-bold">{vehicleJourneyInfo.uniqueLabel}</td>
      <td className="border-r">
        {mapDurationToShortTime(vehicleJourneyInfo.startTime)}
      </td>
      <td className="border-r">
        {getLocalizedTextFromDbBlob(vehicleJourneyInfo.dayTypeName)}
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
