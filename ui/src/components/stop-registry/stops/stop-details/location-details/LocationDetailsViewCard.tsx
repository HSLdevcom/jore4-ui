import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapSignContentTypeToUiName } from '../../../../../i18n/uiNameMappings';
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
  signContentType: 'LocationDetailsViewCard::signContentType',
  terminal: 'LocationDetailsViewCard::terminal',
  terminalName: 'LocationDetailsViewCard::terminalName',
  terminalStops: 'LocationDetailsViewCard::terminalStops',
  platformNumber: 'LocationDetailsViewCard::platformNumber',
  memberPlatforms: 'LocationDetailsViewCard::memberPlatforms',
};

type LocationDetailsViewCardProps = {
  readonly stop: StopWithDetails;
};

export const LocationDetailsViewCard: FC<LocationDetailsViewCardProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  const signContentType =
    stop.quay?.placeEquipments?.generalSign?.at(0)?.signContentType;
  const signContentText = signContentType
    ? mapSignContentTypeToUiName(t, signContentType)
    : t('signContentTypeEnum.none');

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
          detail={
            Number.isFinite(stop.quay?.functionalArea)
              ? `${stop.quay?.functionalArea} m`
              : null
          }
          testId={testIds.functionalArea}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.location.platformNumber')}
          detail={stop.quay?.placeEquipments?.generalSign?.[0]?.content?.value}
          testId={testIds.platformNumber}
        />
        <LabeledDetail
          title={t('stopDetails.location.signContentType')}
          detail={signContentText}
          testId={testIds.signContentType}
        />
        <LabeledDetail
          title={t('stopDetails.location.memberPlatforms')}
          detail={null /* TODO */}
          testId={testIds.memberPlatforms}
        />
      </DetailRow>
    </div>
  );
};
