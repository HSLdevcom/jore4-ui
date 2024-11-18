import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import {
  HorizontalSeparator,
  Row,
  Visible,
} from '../../../../../layoutComponents';
import { DetailRow, LabeledDetail } from '../layout';

const testIds = {
  posterContainer: 'InfoSpotPosterDetails::container',
  posterSize: 'InfoSpotPosterDetails::posterSize',
  posterLabel: 'InfoSpotPosterDetails::posterLabel',
  posterLines: 'InfoSpotPosterDetails::posterLines',
};

type Props = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotPosterDetails: FC<Props> = ({
  infoSpot: { poster, infoSpotType },
}) => {
  const { t } = useTranslation();

  if (infoSpotType !== 'static') {
    return null;
  }

  if (!poster?.length) {
    return (
      <>
        <Row className="my-5 font-bold">
          {t('stopDetails.infoSpots.noPosters')}
        </Row>
        <HorizontalSeparator className="-mx-5" />
      </>
    );
  }

  return poster?.map((item, index) => (
    <div key={item?.label} data-testid={testIds.posterContainer}>
      <DetailRow className="pl-5">
        <LabeledDetail
          title={t('stopDetails.infoSpots.posterSize')}
          detail={item?.posterSize}
          testId={testIds.posterSize}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.posterLabel')}
          detail={item?.label}
          testId={testIds.posterLabel}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.posterLines')}
          detail={item?.lines}
          testId={testIds.posterLines}
        />
      </DetailRow>
      <Visible visible>
        <HorizontalSeparator
          className={index !== poster.length - 1 ? 'ml-5' : '-mx-5'}
        />
      </Visible>
    </div>
  ));
};
