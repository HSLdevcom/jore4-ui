import { FC } from 'react';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { mapDurationToShortTime, mapToShortDate } from '../../../../time';
import { VehicleJourneyInfo } from '../hooks';

type VehicleJourneyRowProps = {
  readonly vehicleJourneyInfo: VehicleJourneyInfo;
};

export const VehicleJourneyRow: FC<VehicleJourneyRowProps> = ({
  vehicleJourneyInfo,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  return (
    <tr className="border odd:bg-white even:bg-hsl-neutral-blue [&>td]:border-light-grey">
      <td className="border-r px-8 py-2 font-bold">
        {vehicleJourneyInfo.uniqueLabel}
      </td>
      <td className="border-r px-8 py-2">
        {mapDurationToShortTime(vehicleJourneyInfo.startTime)}
      </td>
      <td className="border-r px-8 py-2">
        {getLocalizedTextFromDbBlob(vehicleJourneyInfo.dayTypeName)}
      </td>
      <td className="py-2 pr-0 pl-8">
        {mapToShortDate(vehicleJourneyInfo.validityStart)}
      </td>
      <td className="px-2 py-2">&ndash;</td>
      <td className="border-r py-2 pr-8 pl-0">
        {mapToShortDate(vehicleJourneyInfo.validityEnd)}
      </td>
      <td className="border-r px-8 py-2">
        {vehicleJourneyInfo.contractNumber}
      </td>
      <td>{/* Filler */}</td>
    </tr>
  );
};
