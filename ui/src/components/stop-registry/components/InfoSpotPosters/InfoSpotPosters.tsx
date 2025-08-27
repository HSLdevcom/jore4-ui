import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../generated/graphql';
import {
  HorizontalSeparator,
  Row,
  Visible,
} from '../../../../layoutComponents';
import { formatSizedDbItem } from '../../stops/stop-details/info-spots/utils';
import { DetailRow, LabeledDetail } from '../../stops/stop-details/layout';

const testIds = {
  posterContainer: 'InfoSpotPosterDetails::container',
  posterSize: 'InfoSpotPosterDetails::posterSize',
  posterLabel: 'InfoSpotPosterDetails::posterLabel',
  posterLines: 'InfoSpotPosterDetails::posterLines',
  noPosters: 'InfoSpotPosterDetails::noPosters',
};

type InfoSpotPostersProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

const InfoSpotNoPosters = () => {
  const { t } = useTranslation();
  return (
    <Row className="px-10 py-5" testId={testIds.noPosters}>
      <i className="icon-alert mr-2.5 text-hsl-red" role="presentation" />
      {t('stopDetails.infoSpots.noPosters')}
    </Row>
  );
};

export const InfoSpotPosters: FC<InfoSpotPostersProps> = ({ infoSpot }) => {
  const { t } = useTranslation();
  const actualPosters = compact(infoSpot.poster);

  if (!actualPosters.length) {
    return <InfoSpotNoPosters />;
  }

  return (
    <>
      {actualPosters.map((poster, index) => (
        <div key={poster.label} data-testid={testIds.posterContainer}>
          <DetailRow className="px-10 py-5">
            <LabeledDetail
              title={t('stopDetails.infoSpots.posterSize')}
              detail={formatSizedDbItem(t, poster)}
              testId={testIds.posterSize}
            />
            <LabeledDetail
              title={t('stopDetails.infoSpots.posterLabel')}
              detail={poster.label}
              testId={testIds.posterLabel}
            />
            <LabeledDetail
              title={t('stopDetails.infoSpots.posterLines')}
              detail={poster.lines}
              testId={testIds.posterLines}
            />
          </DetailRow>
          <Visible visible={index < actualPosters.length - 1}>
            <HorizontalSeparator className="m-0 border-[--borderColor]" />
          </Visible>
        </div>
      ))}
    </>
  );
};
