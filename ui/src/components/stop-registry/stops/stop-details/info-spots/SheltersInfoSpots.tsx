import compact from 'lodash/compact';
import React, { FC, useMemo } from 'react';
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

  const useShelterInfoSpots = (
    infoSpots: ReadonlyArray<InfoSpotDetailsFragment>,
    shelterId: string | null | undefined
  ) => {
    return useMemo(() => {
      if (!shelterId) {
        return [];
      }
  
      return infoSpots.filter((infoSpot) => {
        return infoSpot.infoSpotLocations?.some(
          (location) => location === shelterId,
        );
      });
    }, [infoSpots, shelterId]);
  };

  return shelters.map((shelter, shelterIndex) => (
      <InfoSpotsSection
        infoSpots={useShelterInfoSpots(infoSpots, shelter.id)}
        shelter={shelter}
        stop={stop}
        shelterIndex={shelterIndex}
      />
  ));
};
