import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { LabeledDetail } from '../layout';
import { formatDimension, optionalBooleanToUiText } from '../utils';

const testIds = {
  backlight: 'InfoSpotDetails::backlight',
  posterPlaceSize: 'InfoSpotDetails::posterPlaceSize',
};

type Props = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotDetails: FC<Props> = ({ infoSpot }) => {
  const { t } = useTranslation();

  return (
    <>
      <LabeledDetail
        title={t('stopDetails.infoSpots.posterPlaceSize')}
        detail={formatDimension(infoSpot.posterPlaceSize)}
        testId={testIds.posterPlaceSize}
      />
      <LabeledDetail
        title={t('stopDetails.infoSpots.backlight')}
        detail={optionalBooleanToUiText(t, infoSpot.backlight)}
        testId={testIds.backlight}
      />
    </>
  );
};
