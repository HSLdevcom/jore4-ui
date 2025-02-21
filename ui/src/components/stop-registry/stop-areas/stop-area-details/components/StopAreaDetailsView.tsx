import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../../time';
import { EnrichedStopPlace } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { StopAreaComponentProps } from '../types';

const testIds = {
  privateCode: 'StopAreaDetails::privateCode',
  name: 'StopAreaDetails::name',
  nameSwe: 'StopAreaDetails::nameSwe',
  description: 'StopAreaDetails::description',
  parentStopPlace: 'StopAreaDetails::parentStopPlace',
  areaSize: 'StopAreaDetails::areaSize',
  validityPeriod: 'StopAreaDetails::validityPeriod',
};

function validityPeriod(area: EnrichedStopPlace) {
  const from = mapToShortDate(area.validityStart);
  const to = mapToShortDate(area.validityEnd);

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
        title={t('stopAreaDetails.basicDetails.privateCode')}
        detail={area.privateCode?.value}
        testId={testIds.privateCode}
      />
      <LabeledDetail
        title={t('stopAreaDetails.basicDetails.name')}
        detail={area.name}
        testId={testIds.name}
      />
      <LabeledDetail
        title={t('stopDetails.basicDetails.nameSwe')}
        detail={area.nameSwe}
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
