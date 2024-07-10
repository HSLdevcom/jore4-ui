import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { LabeledDetail } from '../layout';
import { formatDimension, optionalBooleanToUiText } from '../utils';

const testIds = {
  backlight: 'InfoSpotDetailsStatic::backlight',
  posterPlaceSize: 'InfoSpotDetailsStatic::posterPlaceSize',
  maintenance: 'InfoSpotDetailsStatic::maintenance',
};

type Props = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotDetailsStatic: FC<Props> = ({ infoSpot }) => {
  const { t } = useTranslation();

  if (infoSpot.infoSpotType !== 'static') {
    return null;
  }
  return (
    <>
      <LabeledDetail
        title={t('stopDetails.infoSpots.posterPlaceSize')}
        detail={formatDimension(infoSpot.posterPlaceSize)}
        testId={testIds.posterPlaceSize}
      />
      <LabeledDetail
        title={t('stopDetails.infoSpots.backlight')}
        detail={optionalBooleanToUiText(infoSpot.backlight)}
        testId={testIds.backlight}
      />
      <LabeledDetail
        title={t('stopDetails.infoSpots.maintenance')}
        detail={infoSpot.maintenance}
        testId={testIds.maintenance}
      />
    </>
  );
};
