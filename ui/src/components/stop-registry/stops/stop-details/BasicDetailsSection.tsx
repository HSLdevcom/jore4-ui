import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../hooks';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../i18n/uiNameMappings';
import { DetailRow } from './DetailRow';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';
import { HorizontalSeparator } from './HorizontalSeparator';
import { LabeledDetail } from './LabeledDetail';
import { translateStopTypes } from './utils';

const testIds = {
  detailId: (fieldName: string) => `BasicDetailsSection::${fieldName}`,
};

interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  const transportMode =
    stop.stop_place?.transportMode &&
    mapStopRegistryTransportModeTypeToUiName(stop.stop_place?.transportMode);

  const stopState =
    stop.stop_place?.stopState &&
    mapStopPlaceStateToUiName(stop.stop_place?.stopState);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.basicDetails')}
      testIdPrefix="BasicDetailsSection"
    >
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.label')}
          testId={testIds.detailId('label')}
          detail={stop.label}
        />
        <LabeledDetail
          title={t('stopDetails.publicCode')}
          testId={testIds.detailId('publicCode')}
          detail={stop.stop_place?.publicCode}
        />
        <LabeledDetail
          title={t('stopDetails.nameFin')}
          testId={testIds.detailId('nameFin')}
          detail={stop.stop_place?.nameFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameSwe')}
          testId={testIds.detailId('nameSwe')}
          detail={stop.stop_place?.nameSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.nameLongFin')}
          testId={testIds.detailId('nameLongFin')}
          detail={stop.stop_place?.nameLongFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameLongSwe')}
          testId={testIds.detailId('nameLongSwe')}
          detail={stop.stop_place?.nameLongSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.locationFin')}
          testId={testIds.detailId('locationFin')}
          detail={stop.stop_place?.locationFin}
        />
        <LabeledDetail
          title={t('stopDetails.locationSwe')}
          testId={testIds.detailId('locationSwe')}
          detail={stop.stop_place?.locationSwe}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.abbreviationFin')}
          testId={testIds.detailId('abbreviationFin')}
          detail={stop.stop_place?.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviationSwe')}
          testId={testIds.detailId('abbreviationSwe')}
          detail={stop.stop_place?.abbreviationSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharFin')}
          testId={testIds.detailId('abbreviation5CharFin')}
          detail={stop.stop_place?.abbreviation5CharFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharSwe')}
          testId={testIds.detailId('abbreviation5CharSwe')}
          detail={stop.stop_place?.abbreviation5CharSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.transportMode')}
          testId={testIds.detailId('transportMode')}
          detail={transportMode}
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          testId={testIds.detailId('timingPlaceId')}
          detail={stop.timing_place?.label}
        />
        <LabeledDetail
          title={t('stopDetails.stopType')}
          testId={testIds.detailId('stopType')}
          detail={stop.stop_place && translateStopTypes(stop.stop_place)}
        />
        <LabeledDetail
          title={t('stopDetails.stopState')}
          testId={testIds.detailId('stopState')}
          detail={stopState}
        />
        <LabeledDetail
          title={t('stopDetails.elyNumber')}
          testId={testIds.detailId('elyNumber')}
          detail={stop.stop_place?.elyNumber}
        />
      </DetailRow>
    </ExpandableInfoContainer>
  );
};
