import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopPlaceWithDetails } from '../../../../../hooks';
import { mapToShortDate } from '../../../../../time';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  name: 'StopAreaDetails::name',
  nameFin: 'StopAreaDetails::nameFin',
  nameSwe: 'StopAreaDetails::nameSwe',
  description: 'StopAreaDetails::description',
  parentStopPlace: 'StopAreaDetails::parentStopPlace',
  areaSize: 'StopAreaDetails::areaSize',
  validityPeriod: 'StopAreaDetails::validityPeriod',
};

function validityPeriod(area: StopPlaceWithDetails) {
  const from = mapToShortDate(area.stop_place?.validityStart);
  const to = mapToShortDate(area.stop_place?.validityEnd);

  if (from ?? to) {
    return `${from ?? ''}-${to ?? ''}`;
  }

  return null;
}

export const StopAreaDetailsView: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <DetailRow className={twMerge('mb-0 flex-grow flex-wrap py-0', className)}>
      <LabeledDetail
        title={t('stopAreaDetails.basicDetails.name')}
        detail={area.stop_place?.name}
        testId={testIds.name}
      />
      <LabeledDetail
        title={t('stopDetails.basicDetails.nameSwe')}
        detail={area.stop_place?.nameSwe}
        testId={testIds.nameSwe}
      />
      <LabeledDetail
        title={t('stopAreaDetails.basicDetails.parentTerminal')}
        detail={null}
        testId={testIds.parentStopPlace}
      />
      <LabeledDetail
        title={t('stopAreaDetails.basicDetails.areaSize')}
        detail={null}
        testId={testIds.areaSize}
      />
      <LabeledDetail
        title={t('stopAreaDetails.basicDetails.validityPeriod')}
        detail={validityPeriod(area)}
        testId={testIds.validityPeriod}
      />
    </DetailRow>
  );
};
