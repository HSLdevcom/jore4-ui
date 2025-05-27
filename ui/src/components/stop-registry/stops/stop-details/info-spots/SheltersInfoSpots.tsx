import compact from 'lodash/compact';
import { FC, useMemo } from 'react';
import {
  InfoSpotDetailsFragment,
  ShelterEquipmentDetailsFragment,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import { InfoSpotsSection } from './InfoSpotsSection';

type SheltersInfoSpotsSectionProps = {
  readonly stop: StopWithDetails;
};

type ShelterAndSpots = [
  ShelterEquipmentDetailsFragment,
  ReadonlyArray<InfoSpotDetailsFragment>,
];

const useSheltersInfoSpots = (
  stop: StopWithDetails,
): ReadonlyArray<ShelterAndSpots> => {
  return useMemo(() => {
    const infoSpots: Array<InfoSpotDetailsFragment> = compact(
      stop.quay?.infoSpots ?? [],
    );
    const shelters: Array<ShelterEquipmentDetailsFragment> = compact(
      stop.quay?.placeEquipments?.shelterEquipment ?? [],
    );

    return shelters.map((shelter) => {
      const shelterSpots = infoSpots.filter((infoSpot) =>
        infoSpot.infoSpotLocations?.some((location) => location === shelter.id),
      );
      return [shelter, shelterSpots] as ShelterAndSpots;
    });
  }, [stop]);
};

export const SheltersInfoSpotsSection: FC<SheltersInfoSpotsSectionProps> = ({
  stop,
}) => {
  const items = useSheltersInfoSpots(stop);

  return items.map(([shelter, shelterInfoSpots]) => (
    <InfoSpotsSection
      key={shelter.id}
      infoSpots={shelterInfoSpots}
      shelter={shelter}
      stop={stop}
      shelterNumber={shelter.shelterNumber ?? null}
    />
  ));
};
