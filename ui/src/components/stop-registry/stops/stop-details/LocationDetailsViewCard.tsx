import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { DetailRow } from './DetailRow';
import { HorizontalSeparator } from './HorizontalSeparator';
import { LabeledDetail } from './LabeledDetail';

const testIds = {
  container: 'LocationDetailsViewCard::container',
  detailId: (fieldName: string) => `LocationDetailsViewCard::${fieldName}`,
};

interface Props {
  stop: StopWithDetails;
}

export const LocationDetailsViewCard = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const functionalArea =
    isNumber(stop.stop_place?.functionalArea) &&
    `${stop.stop_place?.functionalArea} m`;

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.stopAddress')}
          detail={stop.stop_place?.streetAddress}
          testId={testIds.detailId('stopAddress')}
        />
        <LabeledDetail
          title={t('stopDetails.location.postalCode')}
          detail={stop.stop_place?.postalCode}
          testId={testIds.detailId('postalCode')}
        />
        <LabeledDetail
          title={t('stopDetails.location.municipality')}
          detail={null /* TODO */}
          testId={testIds.detailId('municipality')}
        />
        <LabeledDetail
          title={t('stopDetails.location.tariffZone')}
          detail={null}
          testId={testIds.detailId('tariffZone')}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.latitude')}
          detail={stop.measured_location.coordinates[1]}
          testId={testIds.detailId('latitude')}
        />
        <LabeledDetail
          title={t('stopDetails.location.longitude')}
          detail={stop.measured_location.coordinates[0]}
          testId={testIds.detailId('longitude')}
        />
        <LabeledDetail
          title={t('stopDetails.location.altitude')}
          detail={stop.measured_location.coordinates[2]}
          testId={testIds.detailId('altitude')}
        />
        <LabeledDetail
          title={t('stopDetails.location.functionalArea')}
          detail={functionalArea}
          testId={testIds.detailId('functionalArea')}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.stopArea')}
          detail={null /* TODO */}
          testId={testIds.detailId('stopArea')}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaName')}
          detail={null /* TODO */}
          testId={testIds.detailId('stopAreaName')}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaStops')}
          detail={null /* TODO */}
          testId={testIds.detailId('stopAreaStops')}
        />
        <LabeledDetail
          title={t('stopDetails.location.quay')}
          detail={null /* TODO */}
          testId={testIds.detailId('quay')}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaQuays')}
          detail={null /* TODO */}
          testId={testIds.detailId('stopAreaQuays')}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.terminal')}
          detail={null /* TODO */}
          testId={testIds.detailId('terminal')}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalName')}
          detail={null /* TODO */}
          testId={testIds.detailId('terminalName')}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalStops')}
          detail={null /* TODO */}
          testId={testIds.detailId('terminalStops')}
        />
      </DetailRow>
    </div>
  );
};
