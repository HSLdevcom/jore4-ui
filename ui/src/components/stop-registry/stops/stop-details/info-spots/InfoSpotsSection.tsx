import compact from 'lodash/compact';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { InfoSpotsViewList } from './InfoSpotsViewList';

interface Props {
  stop: StopWithDetails;
}

export const InfoSpotsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
  });

  const infoSpots: Array<InfoSpotDetailsFragment> = compact(
    stop.stop_place?.infoSpots ?? [],
  );

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={t('stopDetails.detailTabs.info', { count: infoSpots.length })}
      testIdPrefix="InfoSpotsSection"
    >
      {infoContainerControls.isInEditMode ? (
        <h2>Edit mode TODO</h2>
      ) : (
        <InfoSpotsViewList infoSpots={infoSpots} />
      )}
    </InfoContainer>
  );
};
