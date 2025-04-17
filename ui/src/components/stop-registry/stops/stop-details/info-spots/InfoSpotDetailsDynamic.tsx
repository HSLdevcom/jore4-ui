import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { LabeledDetail } from '../layout';
import { optionalBooleanToUiText, trInfoSpotDisplayType } from '../utils';

const testIds = {
  displayType: 'InfoSpotDetailsDynamic::displayType',
  speechProperty: 'InfoSpotDetailsDynamic::speechProperty',
};

type Props = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotDetailsDynamic: FC<Props> = ({ infoSpot }) => {
  const { t } = useTranslation();

  if (infoSpot.infoSpotType !== 'dynamic') {
    return null;
  }

  return (
    <>
      <LabeledDetail
        title={t('stopDetails.infoSpots.displayType')}
        detail={trInfoSpotDisplayType(t, infoSpot.displayType)}
        testId={testIds.displayType}
      />
      <LabeledDetail
        title={t('stopDetails.infoSpots.speechProperty')}
        detail={optionalBooleanToUiText(t, infoSpot.speechProperty)}
        testId={testIds.speechProperty}
      />
    </>
  );
};
