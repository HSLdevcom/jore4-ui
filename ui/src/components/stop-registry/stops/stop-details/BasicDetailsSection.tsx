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

interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle();

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
    >
      <DetailRow>
        <LabeledDetail title={t('stopDetails.label')} detail={stop.label} />
        <LabeledDetail
          title={t('stopDetails.publicCode')}
          detail={stop.stop_place?.publicCode}
        />
        <LabeledDetail
          title={t('stopDetails.nameFin')}
          detail={stop.stop_place?.nameFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameSwe')}
          detail={stop.stop_place?.nameSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.nameLongFin')}
          detail={stop.stop_place?.nameLongFin}
        />
        <LabeledDetail
          title={t('stopDetails.nameLongSwe')}
          detail={stop.stop_place?.nameLongSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.locationFin')}
          detail={stop.stop_place?.locationFin}
        />
        <LabeledDetail
          title={t('stopDetails.locationSwe')}
          detail={stop.stop_place?.locationSwe}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.abbreviationFin')}
          detail={stop.stop_place?.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviationSwe')}
          detail={stop.stop_place?.abbreviationSwe}
        />
        <div className="h-9 w-[0px] border-r border-black" />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharFin')}
          detail={stop.stop_place?.abbreviation5CharFin}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviation5CharSwe')}
          detail={stop.stop_place?.abbreviation5CharSwe}
        />
      </DetailRow>
      <HorizontalSeparator />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.transportMode')}
          detail={transportMode}
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          detail={stop.timing_place?.label}
        />
        <LabeledDetail
          title={t('stopDetails.stopType')}
          detail={stop.stop_place && translateStopTypes(stop.stop_place)}
        />
        <LabeledDetail title={t('stopDetails.stopState')} detail={stopState} />
        <LabeledDetail
          title={t('stopDetails.elyNumber')}
          detail={stop.stop_place?.elyNumber}
        />
      </DetailRow>
    </ExpandableInfoContainer>
  );
};
