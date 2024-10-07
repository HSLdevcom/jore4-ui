import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import { mapLngLatToPoint } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { InfoSpotsViewList } from './InfoSpotsViewList';

type Props = {
  readonly stop: StopWithDetails;
};

export const InfoSpotsSection: FC<Props> = ({ stop }) => {
  const { t } = useTranslation();

  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
  });

  const infoSpots: Array<InfoSpotDetailsFragment> = compact(
    stop.stop_place?.infoSpots ?? [],
  );

  const location = mapLngLatToPoint(stop.measured_location.coordinates);

  const stopName = stop.label;

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
        <InfoSpotsViewList
          infoSpots={infoSpots}
          location={location}
          stopName={stopName}
        />
      )}
    </InfoContainer>
  );
};
