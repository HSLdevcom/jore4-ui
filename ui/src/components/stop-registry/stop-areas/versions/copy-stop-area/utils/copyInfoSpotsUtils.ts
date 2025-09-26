import compact from 'lodash/compact';
import { QuayDetailsFragment } from '../../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../../types';
import { FailedToResolveExistingShelter } from '../../../../stops/stop-details/stop-version/errors';
import { mapCompactOrNull, mapInfoSpotToInput } from '../../../../utils';
import { BidirectionalQuayMap, InfoSpotInput } from '../types';

function mapQuayToInfoSpotInput(
  quay: QuayDetailsFragment | null,
  mapping: BidirectionalQuayMap,
): InfoSpotInput | null {
  if (!quay || !quay.id) {
    return null;
  }

  const newLocationQuay = mapping.copiedQuays.get(quay.id);
  if (!newLocationQuay || !newLocationQuay.id) {
    // No matching quay found in the copied quays, skip this quay
    return null;
  }

  const shelters = quay?.placeEquipments?.shelterEquipment;
  const infoSpots = mapCompactOrNull(quay?.infoSpots, (infoSpot) => {
    const originalShelter =
      shelters?.find(
        (shelter) =>
          shelter &&
          shelter.id &&
          infoSpot.infoSpotLocations?.includes(shelter.id),
      ) ?? null;

    const originalShelterIndex = shelters?.indexOf(originalShelter) ?? -1;

    if (!originalShelter || originalShelterIndex < 0) {
      throw new FailedToResolveExistingShelter(
        `Failed to resolve existing shelter for infoSpot: ${JSON.stringify(infoSpot)}`,
      );
    }

    return {
      originalShelter,
      originalShelterIndex,
      infoSpotInput: mapInfoSpotToInput(infoSpot),
    };
  });

  if (infoSpots === null) {
    return null;
  }

  return {
    quayId: newLocationQuay.id,
    infoSpots,
  };
}

export function mapToInfoSpotInput(
  stopArea: EnrichedStopPlace,
  mapping: BidirectionalQuayMap,
): ReadonlyArray<InfoSpotInput> {
  if (!stopArea.quays || stopArea.quays.length === 0) {
    return [];
  }

  const inputs = stopArea.quays.map((quay) =>
    mapQuayToInfoSpotInput(quay, mapping),
  );

  return compact(inputs);
}
