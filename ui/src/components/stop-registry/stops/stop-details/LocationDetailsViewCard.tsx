import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { DetailRow } from './DetailRow';
import { HorizontalSeparator } from './HorizontalSeparator';
import { LabeledDetail } from './LabeledDetail';

interface Props {
  stop: StopWithDetails;
}

export const LocationDetailsViewCard = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const functionalArea =
    isNumber(stop.stop_place?.functionalArea) &&
    `${stop.stop_place?.functionalArea} m`;

  return (
    <div>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.stopAddress')}
          detail={stop.stop_place?.streetAddress}
        />
        <LabeledDetail
          title={t('stopDetails.location.postalCode')}
          detail={stop.stop_place?.postalCode}
        />
        <LabeledDetail
          title={t('stopDetails.location.municipality')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.tariffZone')}
          detail={null}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.latitude')}
          detail={stop.measured_location.coordinates[1]}
        />
        <LabeledDetail
          title={t('stopDetails.location.longitude')}
          detail={stop.measured_location.coordinates[0]}
        />
        <LabeledDetail
          title={t('stopDetails.location.altitude')}
          detail={stop.measured_location.coordinates[2]}
        />
        <LabeledDetail
          title={t('stopDetails.location.functionalArea')}
          detail={functionalArea}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.stopArea')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaName')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaStops')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.quay')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaQuays')}
          detail={null /* TODO */}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.terminal')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalName')}
          detail={null /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalStops')}
          detail={null /* TODO */}
        />
      </DetailRow>
    </div>
  );
};
