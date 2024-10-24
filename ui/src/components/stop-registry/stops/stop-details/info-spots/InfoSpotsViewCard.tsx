import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { Point } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../layout';
import { trInfoSpotType } from '../utils';
import { InfoSpotDetailsDynamic } from './InfoSpotDetailsDynamic';
import { InfoSpotDetailsStatic } from './InfoSpotDetailsStatic';
import { InfoSpotPosterDetails } from './InfoSpotPosterDetails';
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

type Props = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly location: Point;
  readonly stopName: string;
};

export const InfoSpotsViewCard: FC<Props> = ({
  infoSpot,
  location,
  stopName,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.container}>
      {/* Has negative margin to stretch grey bg to previous div */}
      <div className="-mx-5 bg-background px-5">
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
            title={t('stopDetails.infoSpots.infoSpotType')}
            detail={trInfoSpotType(t, infoSpot.infoSpotType)}
            testId={testIds.infoSpotType}
          />
          <InfoSpotDetailsStatic infoSpot={infoSpot} />
          <InfoSpotDetailsDynamic infoSpot={infoSpot} />
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
            title={t('stopDetails.infoSpots.description')}
            detail={infoSpot.description?.value}
            testId={testIds.description}
          />
        </DetailRow>
      </div>
      <InfoSpotPosterDetails infoSpot={infoSpot} />
      <InfoSpotZoneDetails infoSpot={infoSpot} stopName={stopName} />
    </div>
  );
};
