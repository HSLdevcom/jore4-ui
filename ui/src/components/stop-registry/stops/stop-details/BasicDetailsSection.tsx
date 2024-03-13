import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../i18n/uiNameMappings';
import { DetailRow } from './DetailRow';
import { ExpandableInfoContainer } from './ExpandableInfoContainer';
import { LabeledDetail } from './LabeledDetail';

interface Props {
  stop: StopWithDetails;
}

export const BasicDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, setExpanded] = useState(true /* false */);
  const toggleExpanded = () => {
    setExpanded(!isExpanded);
  };

  return (
    <ExpandableInfoContainer
      onToggle={toggleExpanded}
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
      <hr className="py-2" />
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
          detail={'-' /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.abbreviationSwe')}
          detail={'-' /* TODO */}
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
      <hr className="py-2" />
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.transportMode')}
          detail={
            stop.stop_place?.transportMode
              ? mapStopRegistryTransportModeTypeToUiName(
                  stop.stop_place?.transportMode,
                )
              : '-'
          }
        />
        <LabeledDetail
          title={t('stops.timingPlaceId')}
          detail={stop.timing_place?.label || '-'}
        />
        <LabeledDetail
          title={t('stopDetails.stopType')}
          detail={'-' /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.stopStatus')}
          detail={'-' /* TODO */}
        />
        <LabeledDetail
          title={t('stopDetails.elyNumber')}
          detail={stop.stop_place?.elyNumber}
        />
      </DetailRow>
    </ExpandableInfoContainer>
  );
};
