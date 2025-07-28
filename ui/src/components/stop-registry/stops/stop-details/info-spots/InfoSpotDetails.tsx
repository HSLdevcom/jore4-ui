import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { LabeledDetail } from '../layout';
import { optionalBooleanToUiText } from '../utils';
import { formatSizedDbItem } from './utils';

const testIds = {
  backlight: 'InfoSpotDetails::backlight',
  size: 'InfoSpotDetails::size',
};

type InfoSpotDetailsProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotDetails: FC<InfoSpotDetailsProps> = ({ infoSpot }) => {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};
