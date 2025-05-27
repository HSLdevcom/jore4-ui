import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { DetailRow, LabeledDetail } from '../layout';

const testIds = {
  floor: 'InfoSpotZoneDetails::floor',
  railInformation: 'InfoSpotZoneDetails::railInformation',
  stops: 'InfoSpotZoneDetails::stops',
  terminals: 'InfoSpotZoneDetails::terminals',
  zoneLabel: 'InfoSpotZoneDetails::zoneLabel',
};

type InfoSpotZoneDetailsProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly stopName: string;
};

export const InfoSpotZoneDetails: FC<InfoSpotZoneDetailsProps> = ({
  infoSpot,
  stopName,
}) => {
  const { t } = useTranslation();
  return (
    <DetailRow>
      <LabeledDetail
        title={t('stopDetails.infoSpots.stops')}
        detail={stopName}
        testId={testIds.stops}
      />
      <LabeledDetail
        title={t('stopDetails.infoSpots.terminals')}
        detail="-"
        testId={testIds.terminals}
      />
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
  );
};
