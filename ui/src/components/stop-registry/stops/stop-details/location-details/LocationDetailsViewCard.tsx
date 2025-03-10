import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { HorizontalSeparator } from '../../../../../layoutComponents';
import { StopWithDetails } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../layout';

const testIds = {
  container: 'LocationDetailsViewCard::container',
  streetAddress: 'LocationDetailsViewCard::streetAddress',
  postalCode: 'LocationDetailsViewCard::postalCode',
  municipality: 'LocationDetailsViewCard::municipality',
  fareZone: 'LocationDetailsViewCard::fareZone',
  latitude: 'LocationDetailsViewCard::latitude',
  longitude: 'LocationDetailsViewCard::longitude',
  altitude: 'LocationDetailsViewCard::altitude',
  functionalArea: 'LocationDetailsViewCard::functionalArea',
  stopArea: 'LocationDetailsViewCard::stopArea',
  stopAreaName: 'LocationDetailsViewCard::stopAreaName',
  stopAreaStops: 'LocationDetailsViewCard::stopAreaStops',
  quay: 'LocationDetailsViewCard::quay',
  stopAreaQuays: 'LocationDetailsViewCard::stopAreaQuays',
  terminal: 'LocationDetailsViewCard::terminal',
  terminalName: 'LocationDetailsViewCard::terminalName',
  terminalStops: 'LocationDetailsViewCard::terminalStops',
};

interface Props {
  stop: StopWithDetails;
}

export const LocationDetailsViewCard = ({
  stop,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  const functionalArea =
    isNumber(stop.quay?.functionalArea) && `${stop.quay.functionalArea} m`;

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.streetAddress')}
          detail={stop.quay?.streetAddress}
          testId={testIds.streetAddress}
        />
        <LabeledDetail
          title={t('stopDetails.location.postalCode')}
          detail={stop.quay?.postalCode}
          testId={testIds.postalCode}
        />
        <LabeledDetail
          title={t('stopDetails.location.municipality')}
          detail={stop.stop_place?.municipality}
          testId={testIds.municipality}
        />
        <LabeledDetail
          title={t('stopDetails.location.fareZone')}
          detail={stop.stop_place?.fareZone}
          testId={testIds.fareZone}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.latitude')}
          detail={stop.measured_location.coordinates[1]}
          testId={testIds.latitude}
        />
        <LabeledDetail
          title={t('stopDetails.location.longitude')}
          detail={stop.measured_location.coordinates[0]}
          testId={testIds.longitude}
        />
        <LabeledDetail
          title={t('stopDetails.location.altitude')}
          detail={stop.measured_location.coordinates[2]}
          testId={testIds.altitude}
        />
        <LabeledDetail
          title={t('stopDetails.location.functionalArea')}
          detail={functionalArea}
          testId={testIds.functionalArea}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.stopArea')}
          detail={null /* TODO */}
          testId={testIds.stopArea}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaName')}
          detail={null /* TODO */}
          testId={testIds.stopAreaName}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaStops')}
          detail={null /* TODO */}
          testId={testIds.stopAreaStops}
        />
        <LabeledDetail
          title={t('stopDetails.location.quay')}
          detail={
            null /* TODO:  stop.quay?.placeEquipments?.generalSign?.content?.value */
          }
          testId={testIds.quay}
        />
        <LabeledDetail
          title={t('stopDetails.location.stopAreaQuays')}
          detail={null /* TODO */}
          testId={testIds.stopAreaQuays}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.terminal')}
          detail={null /* TODO */}
          testId={testIds.terminal}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalName')}
          detail={null /* TODO */}
          testId={testIds.terminalName}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalStops')}
          detail={null /* TODO */}
          testId={testIds.terminalStops}
        />
      </DetailRow>
    </div>
  );
};
