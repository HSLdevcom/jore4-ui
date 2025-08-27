import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { Point } from '../../../../../types';
import { InfoSpotPosters } from '../../../components/InfoSpotPosters/InfoSpotPosters';
import { DetailRow, LabeledDetail } from '../layout';
import { InfoSpotDetails } from './InfoSpotDetails';
import { InfoSpotZoneDetails } from './InfoSpotZoneDetails';

const testIds = {
  container: 'InfoSpotsViewCard::container',
  description: 'InfoSpotsViewCard::description',
  label: 'InfoSpotsViewCard::label',
  infoSpotType: 'InfoSpotsViewCard::infoSpotType',
  purpose: 'InfoSpotsViewCard::purpose',
  latitude: 'InfoSpotsViewCard::latitude',
  longitude: 'InfoSpotsViewCard::longitude',
};

type InfoSpotsViewCardProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly location: Point;
  readonly stopName: string;
};

export const InfoSpotsViewCard: FC<InfoSpotsViewCardProps> = ({
  infoSpot,
  location,
  stopName,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.container}>
      <div className="bg-background p-5">
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
          <InfoSpotDetails infoSpot={infoSpot} />
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
        <InfoSpotZoneDetails infoSpot={infoSpot} stopName={stopName} />
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
