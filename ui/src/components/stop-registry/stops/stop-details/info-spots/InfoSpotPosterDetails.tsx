import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import {
  HorizontalSeparator,
  Row,
  Visible,
} from '../../../../../layoutComponents';
import { DetailRow, LabeledDetail } from '../layout';
import { formatDimension } from '../utils';

const testIds = {
  posterContainer: 'InfoSpotPosterDetails::container',
  posterSize: 'InfoSpotPosterDetails::posterSize',
  posterLabel: 'InfoSpotPosterDetails::posterLabel',
  posterLines: 'InfoSpotPosterDetails::posterLines',
  noPosters: 'InfoSpotPosterDetails::noPosters',
};

type InfoSpotPosterDetailsProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export const InfoSpotPosterDetails: FC<InfoSpotPosterDetailsProps> = ({
  infoSpot: { poster },
}) => {
  const { t } = useTranslation();

  if (!poster?.length) {
    return (
      <>
        <Row className="px-10 py-5" testId={testIds.noPosters}>
          <i className="icon-alert mr-2.5 text-hsl-red" role="presentation" />
          {t('stopDetails.infoSpots.noPosters')}
        </Row>
      </>
    );
  }

  return poster?.map((item, index) => (
    <div key={item?.label} data-testid={testIds.posterContainer}>
      <DetailRow className="px-10 py-5">
        <LabeledDetail
          title={t('stopDetails.infoSpots.posterSize')}
          detail={formatDimension(item?.posterSize)}
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
      <Visible visible={index === poster.length - 1}>
        <HorizontalSeparator className="m-0 border-[--borderColor]" />
      </Visible>
    </div>
  ));
};
