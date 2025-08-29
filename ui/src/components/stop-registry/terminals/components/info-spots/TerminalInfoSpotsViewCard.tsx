import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotPosters } from '../../../components/InfoSpotPosters/InfoSpotPosters';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { optionalBooleanToUiText } from '../../../stops/stop-details/utils';
import { TerminalInfoSpotsViewCardProps } from './types';

const testIds = {
  container: 'TerminalInfoSpotsViewCard::container',
  description: 'TerminalInfoSpotsViewCard::description',
  label: 'TerminalInfoSpotsViewCard::label',
  infoSpotType: 'TerminalInfoSpotsViewCard::infoSpotType',
  purpose: 'TerminalInfoSpotsViewCard::purpose',
  latitude: 'TerminalInfoSpotsViewCard::latitude',
  longitude: 'TerminalInfoSpotsViewCard::longitude',
  backlight: 'TerminalInfoSpotsViewCard::backlight',
  size: 'TerminalInfoSpotsViewCard::size',
  floor: 'TerminalInfoSpotsViewCard::floor',
  railInformation: 'TerminalInfoSpotsViewCard::railInformation',
  zoneLabel: 'TerminalInfoSpotsViewCard::zoneLabel',
};

export const TerminalInfoSpotsViewCard: FC<TerminalInfoSpotsViewCardProps> = ({
  infoSpot,
  location,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.container}>
      <div className="bg-background-hsl-commuter-train-purple bg-opacity-25 p-5 pt-0">
        <DetailRow>
          <LabeledDetail
            title={t('stopDetails.infoSpots.label')}
            detail={infoSpot.label}
            testId={testIds.label}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.purpose')}
            detail={infoSpot.purpose}
            testId={testIds.purpose}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.size')}
            detail={formatSizedDbItem(t, infoSpot)}
            testId={testIds.size}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.backlight')}
            detail={optionalBooleanToUiText(t, infoSpot.backlight)}
            testId={testIds.backlight}
          />
          <LabeledDetail
            title={t('stopDetails.location.latitude')}
            detail={location.latitude}
            testId={testIds.latitude}
          />
          <LabeledDetail
            title={t('stopDetails.location.longitude')}
            detail={location.longitude}
            testId={testIds.longitude}
          />
        </DetailRow>
        <DetailRow>
          <LabeledDetail
            title={t('stopDetails.infoSpots.zoneLabel')}
            detail={infoSpot.zoneLabel}
            testId={testIds.zoneLabel}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.railInformation')}
            detail={infoSpot.railInformation}
            testId={testIds.railInformation}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.floor')}
            detail={infoSpot.floor}
            testId={testIds.floor}
          />
        </DetailRow>
        <DetailRow>
          <LabeledDetail
            title={t('stopDetails.infoSpots.description')}
            detail={infoSpot.description?.value}
            testId={testIds.description}
          />
        </DetailRow>
      </div>
      <InfoSpotPosters infoSpot={infoSpot} />
    </div>
  );
};
