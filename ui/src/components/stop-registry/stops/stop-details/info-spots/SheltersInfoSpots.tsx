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

function useInfoSpots(stop: StopWithDetails): Array<InfoSpotDetailsFragment> {
  return compact(stop.stop_place?.infoSpots ?? []);
}

function useShelters(
  stop: StopWithDetails,
): Array<ShelterEquipmentDetailsFragment> {
  return compact(
    stop.stop_place?.quays?.[0]?.placeEquipments?.shelterEquipment ?? [],
  );
}

export const SheltersInfoSpotsSection: FC<Props> = ({ stop }) => {
  const infoSpots = useInfoSpots(stop);
  const shelters = useShelters(stop);

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
