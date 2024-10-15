import compact from 'lodash/compact';
import React, { FC } from 'react';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import { InfoSpotsSection } from './InfoSpotsSection';

type Props = {
  readonly stop: StopWithDetails;
};

export const SheltersInfoSpotsSection: FC<Props> = ({ stop }) => {
  const infoSpots: Array<InfoSpotDetailsFragment> = compact(
    stop.stop_place?.infoSpots ?? [],
  );

  const shelters: Array<ShelterEquipmentDetailsFragment> = compact(
    stop.stop_place?.quays?.[0]?.placeEquipments?.shelterEquipment ?? [],
  );

  const getShelterInfoSpots = (shelterId: string | null | undefined) =>
    infoSpots.filter((infoSpot) => {
      return infoSpot.infoSpotLocations?.some(
        (location) => location === shelterId,
      );
    });

  return shelters.map((shelter, shelterIndex) => (
    <React.Fragment key={shelter.id}>
      <InfoSpotsSection
        infoSpots={getShelterInfoSpots(shelter.id)}
        shelter={shelter}
        stop={stop}
        shelterIndex={shelterIndex}
      />
    </React.Fragment>
  ));
};
