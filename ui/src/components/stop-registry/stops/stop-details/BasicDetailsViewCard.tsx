import { t } from 'i18next';
import { StopWithDetails } from '../../../../hooks';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../i18n/uiNameMappings';
import { DetailRow } from './DetailRow';
import { HorizontalSeparator } from './HorizontalSeparator';
import { LabeledDetail } from './LabeledDetail';
import { translateStopTypes } from './utils';

interface Props {
  stop: StopWithDetails;
}

const testIds = {
  label: 'BasicDetailsSection::label',
  publicCode: 'BasicDetailsSection::publicCode',
  nameFin: 'BasicDetailsSection::nameFin',
  nameSwe: 'BasicDetailsSection::nameSwe',
  nameLongFin: 'BasicDetailsSection::nameLongFin',
  nameLongSwe: 'BasicDetailsSection::nameLongSwe',
  locationFin: 'BasicDetailsSection::locationFin',
  locationSwe: 'BasicDetailsSection::locationSwe',
  abbreviationFin: 'BasicDetailsSection::abbreviationFin',
  abbreviationSwe: 'BasicDetailsSection::abbreviationSwe',
  abbreviation5CharFin: 'BasicDetailsSection::abbreviation5CharFin',
  abbreviation5CharSwe: 'BasicDetailsSection::abbreviation5CharSwe',
  transportMode: 'BasicDetailsSection::transportMode',
  timingPlaceId: 'BasicDetailsSection::timingPlaceId',
  stopType: 'BasicDetailsSection::stopType',
  stopState: 'BasicDetailsSection::stopState',
  elyNumber: 'BasicDetailsSection::elyNumber',
};

export const BasicDetailsViewCard = ({ stop }: Props) => {
  const stopState =
    stop.stop_place?.stopState &&
    mapStopPlaceStateToUiName(stop.stop_place?.stopState);

  const transportMode =
    stop.stop_place?.transportMode &&
    mapStopRegistryTransportModeTypeToUiName(stop.stop_place?.transportMode);
  return (
    <div>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.label')}
          detail={stop.label}
          testId={testIds.label}
        />
        <LabeledDetail
          title={t('stopDetails.publicCode')}
          detail={stop.stop_place?.publicCode}
          testId={testIds.publicCode}
        />
        <LabeledDetail
          title={t('stopDetails.nameFin')}
          detail={stop.stop_place?.nameFin}
          testId={testIds.nameFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameSwe')}
          detail={stop.stop_place?.nameSwe}
          testId={testIds.nameSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.nameLongFin')}
          detail={stop.stop_place?.nameLongFin}
          testId={testIds.nameLongFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameLongSwe')}
          detail={stop.stop_place?.nameLongSwe}
          testId={testIds.nameLongSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.locationFin')}
          detail={stop.stop_place?.locationFin}
          testId={testIds.locationFin}
        />
        <LabeledDetail
          title={t('stopDetails.locationSwe')}
          detail={stop.stop_place?.locationSwe}
          testId={testIds.locationSwe}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.abbreviationFin')}
          detail={stop.stop_place?.abbreviationFin}
          testId={testIds.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviationSwe')}
          detail={stop.stop_place?.abbreviationSwe}
          testId={testIds.abbreviationSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharFin')}
          detail={stop.stop_place?.abbreviation5CharFin}
          testId={testIds.abbreviation5CharFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharSwe')}
          detail={stop.stop_place?.abbreviation5CharSwe}
          testId={testIds.abbreviation5CharSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.transportMode')}
          detail={transportMode}
          testId={testIds.transportMode}
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          detail={stop.timing_place?.label}
          testId={testIds.timingPlaceId}
        />
        <LabeledDetail
          title={t('stopDetails.stopType')}
          detail={stop.stop_place && translateStopTypes(stop.stop_place)}
          testId={testIds.stopType}
        />
        <LabeledDetail
          title={t('stopDetails.stopState')}
          detail={stopState}
          testId={testIds.stopState}
        />
        <LabeledDetail
          title={t('stopDetails.elyNumber')}
          detail={stop.stop_place?.elyNumber}
          testId={testIds.elyNumber}
        />
      </DetailRow>
    </div>
  );
};
