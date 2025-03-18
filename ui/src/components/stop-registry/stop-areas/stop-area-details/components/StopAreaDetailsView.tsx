import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../time';
import { EnrichedStopPlace } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { StopAreaComponentProps } from '../types';

const testIds = {
  privateCode: 'StopAreaDetails::privateCode',
  name: 'StopAreaDetails::name',
  nameSwe: 'StopAreaDetails::nameSwe',
  nameLongFin: 'StopAreaDetails::nameLongFin',
  nameLongSwe: 'StopAreaDetails::nameLongSwe',
  abbreviationFin: 'StopAreaDetails::abbreviationFin',
  abbreviationSwe: 'StopAreaDetails::abbreviationSwe',
  parentTerminal: 'StopAreaDetails::parentTerminal',
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
    <>
      <DetailRow className={className}>
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
          title={t('stopAreaDetails.basicDetails.nameSwe')}
          detail={area.nameSwe}
          testId={testIds.nameSwe}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.parentTerminal')}
          detail={null}
          testId={testIds.parentTerminal}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.validityPeriod')}
          detail={validityPeriod(area)}
          testId={testIds.validityPeriod}
        />
      </DetailRow>
      <DetailRow className={className}>
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.nameLongFin')}
          detail={area.nameLongFin}
          testId={testIds.nameLongFin}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.nameLongSwe')}
          detail={area.nameLongSwe}
          testId={testIds.nameLongSwe}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.abbreviationFin')}
          detail={area.abbreviationFin}
          testId={testIds.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopAreaDetails.basicDetails.abbreviationSwe')}
          detail={area.abbreviationSwe}
          testId={testIds.abbreviationSwe}
        />
      </DetailRow>
    </>
  );
};
