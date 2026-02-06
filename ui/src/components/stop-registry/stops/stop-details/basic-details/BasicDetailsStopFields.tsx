import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { KnownValueKey, findKeyValue } from '../../../../../utils';
import { DetailRow, LabeledDetail } from '../layout';
import { translateStopTypes } from '../utils';

type StopDetailsSectionProps = {
  readonly stop: StopWithDetails;
};

const testIds = {
  label: 'BasicDetailsSection::label',
  privateCode: 'BasicDetailsSection::privateCode',
  nameFin: 'BasicDetailsSection::nameFin',
  nameSwe: 'BasicDetailsSection::nameSwe',
  nameLongFin: 'BasicDetailsSection::nameLongFin',
  nameLongSwe: 'BasicDetailsSection::nameLongSwe',
  locationFin: 'BasicDetailsSection::locationFin',
  locationSwe: 'BasicDetailsSection::locationSwe',
  abbreviationFin: 'BasicDetailsSection::abbreviationFin',
  abbreviationSwe: 'BasicDetailsSection::abbreviationSwe',
  transportMode: 'BasicDetailsSection::transportMode',
  timingPlaceId: 'BasicDetailsSection::timingPlaceId',
  stopType: 'BasicDetailsSection::stopType',
  stopState: 'BasicDetailsSection::stopState',
  elyNumber: 'BasicDetailsSection::elyNumber',
};

export const StopDetailsSection: FC<StopDetailsSectionProps> = ({ stop }) => {
  const { t } = useTranslation();

  const stopState =
    stop.quay?.stopState && mapStopPlaceStateToUiName(t, stop.quay.stopState);

  const transportMode =
    stop.stop_place?.transportMode &&
    mapStopRegistryTransportModeTypeToUiName(t, stop.stop_place.transportMode);

  // Use label from keyValues, fallback to joined data
  const timingPlaceLabel =
    (stop.quay && findKeyValue(stop.quay, KnownValueKey.TimingPlaceLabel)) ??
    stop.timing_place?.label ??
    null;

  return (
    <>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.basicDetails.label')}
          detail={stop.label}
          testId={testIds.label}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.privateCode')}
          detail={stop.quay?.privateCode}
          testId={testIds.privateCode}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.locationFin')}
          detail={stop.quay?.locationFin}
          testId={testIds.locationFin}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.locationSwe')}
          detail={stop.quay?.locationSwe}
          testId={testIds.locationSwe}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.stopState')}
          detail={stopState}
          testId={testIds.stopState}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.basicDetails.transportMode')}
          detail={transportMode}
          testId={testIds.transportMode}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.elyNumber')}
          detail={stop.quay?.elyNumber}
          testId={testIds.elyNumber}
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          detail={timingPlaceLabel}
          testId={testIds.timingPlaceId}
        />
        <div className="flex items-center gap-4">
          <LabeledDetail
            title={t('stopDetails.basicDetails.stopType')}
            detail={stop.quay && translateStopTypes(t, stop.quay)}
            testId={testIds.stopType}
          />
        </div>
      </DetailRow>
    </>
  );
};
