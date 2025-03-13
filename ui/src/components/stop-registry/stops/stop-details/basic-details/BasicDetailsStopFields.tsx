import { useTranslation } from 'react-i18next';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { HorizontalSeparator } from '../../../../../layoutComponents';
import { StopWithDetails } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../layout';
import { MainLineWarning } from '../MainLineWarning';
import { translateStopTypes } from '../utils';

type Props = {
  stop: StopWithDetails;
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
  abbreviation5CharFin: 'BasicDetailsSection::abbreviation5CharFin',
  abbreviation5CharSwe: 'BasicDetailsSection::abbreviation5CharSwe',
  transportMode: 'BasicDetailsSection::transportMode',
  timingPlaceId: 'BasicDetailsSection::timingPlaceId',
  stopType: 'BasicDetailsSection::stopType',
  stopState: 'BasicDetailsSection::stopState',
  elyNumber: 'BasicDetailsSection::elyNumber',
};

export const StopDetailsSection = ({ stop }: Props) => {
  const { t } = useTranslation();

  const stopState =
    stop.quay?.stopState && mapStopPlaceStateToUiName(stop.quay?.stopState);

  const transportMode =
    stop.stop_place?.transportMode &&
    mapStopRegistryTransportModeTypeToUiName(stop.stop_place?.transportMode);

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
          title={t('stopDetails.basicDetails.nameFin')}
          detail={stop.stop_place?.name}
          testId={testIds.nameFin}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.nameSwe')}
          detail={stop.stop_place?.nameSwe}
          testId={testIds.nameSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.basicDetails.nameLongFin')}
          detail={stop.stop_place?.nameLongFin}
          testId={testIds.nameLongFin}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.nameLongSwe')}
          detail={stop.stop_place?.nameLongSwe}
          testId={testIds.nameLongSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
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
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.basicDetails.abbreviationFin')}
          detail={stop.stop_place?.abbreviationFin}
          testId={testIds.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.abbreviationSwe')}
          detail={stop.stop_place?.abbreviationSwe}
          testId={testIds.abbreviationSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.basicDetails.abbreviation5CharFin')}
          detail={stop.stop_place?.abbreviation5CharFin}
          testId={testIds.abbreviation5CharFin}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.abbreviation5CharSwe')}
          detail={stop.stop_place?.abbreviation5CharSwe}
          testId={testIds.abbreviation5CharSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.basicDetails.transportMode')}
          detail={transportMode}
          testId={testIds.transportMode}
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          detail={stop.timing_place?.label}
          testId={testIds.timingPlaceId}
        />
        <div className="flex items-center gap-4">
          <LabeledDetail
            title={t('stopDetails.basicDetails.stopType')}
            detail={stop.quay && translateStopTypes(stop.quay)}
            testId={testIds.stopType}
          />
          <MainLineWarning
            isMainLineStop={!!stop.quay?.stopType.mainLine}
            hasMainLineSign={
              !!stop.quay?.placeEquipments?.generalSign?.[0]?.mainLineSign
            }
          />
        </div>
        <LabeledDetail
          title={t('stopDetails.basicDetails.stopState')}
          detail={stopState}
          testId={testIds.stopState}
        />
        <LabeledDetail
          title={t('stopDetails.basicDetails.elyNumber')}
          detail={stop.quay?.elyNumber}
          testId={testIds.elyNumber}
        />
      </DetailRow>
    </>
  );
};
