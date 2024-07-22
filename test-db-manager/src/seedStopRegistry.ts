/* eslint-disable no-console */
import {
  StopAreaInput,
  StopPlaceInput,
  StopPlaceNetexRef,
  seedStopAreas,
  seedStopPlaces,
} from './datasets';
import { StopRegistryVersionLessEntityRefInput } from './generated/graphql';
import { insertStopPlaceForScheduledStopPoint } from './graphql-helpers';
import { hasuraApi } from './hasuraApi';
import { mapToInsertStopAreaMutation } from './queries';
import { mapToGetStopPointByLabelQuery } from './queries/routesAndLines';
import { GetStopPointByLabelResult, InsertStopAreaResult } from './types';

const insertStopPlace = async ({
  label,
  stopPlace,
}: StopPlaceInput): Promise<StopPlaceNetexRef> => {
  // Find related scheduled stop point.
  const stopPointResult = (await hasuraApi(
    mapToGetStopPointByLabelQuery(label),
  )) as GetStopPointByLabelResult;

  const stopPoints =
    stopPointResult?.data?.service_pattern_scheduled_stop_point;
  const stopPoint = stopPoints && stopPoints[0];
  const stopPointId = stopPoint?.scheduled_stop_point_id;

  if (!stopPointId) {
    throw new Error(
      `Could not find scheduled stop point with label ${label}. Did you forget to import route DB dump?`,
    );
  }
  if (stopPoints.length > 1) {
    // It is possible that there are multiple stop points for one label, with different priorities and/or validity times.
    // With current dump this does not happen, but if things change, we might need some more logic here...
    console.warn(
      `Found multiple stop points for label ${label}, using the first one...`,
    );
  }

  try {
    const stopPlaceRef = await insertStopPlaceForScheduledStopPoint(
      stopPointId,
      stopPlace,
    );

    if (stopPoint.stop_place_ref) {
      console.warn(
        `Stop point ${label} (${stopPointId}) already has a stop place with id ${stopPoint.stop_place_ref}. Overwrote with ${stopPlaceRef}.`,
      );
    }
    return { netexId: stopPlaceRef, label };
  } catch (error) {
    console.error(
      'An error occurred while inserting stop place!',
      label,
      stopPlace,
      error,
    );
    throw error;
  }
};

const insertStopArea = async (
  stopArea: StopAreaInput,
  stopPlaces: Map<string, string>,
) => {
  const area = {
    ...stopArea.stopArea,
    members: stopArea.memberLabels.map(
      (label) =>
        ({
          ref: stopPlaces.get(label),
        }) as StopRegistryVersionLessEntityRefInput,
    ),
  };

  try {
    const returnValue = (await hasuraApi(
      mapToInsertStopAreaMutation(area),
    )) as InsertStopAreaResult;
    if (returnValue.data == null) {
      throw new Error('Null data returned from Tiamat');
    }
  } catch (error) {
    console.error(
      'An error occurred while inserting stop area!',
      stopArea.stopArea.name?.value,
      error,
    );
    throw error;
  }
};

const seedStopRegistry = async () => {
  const collectedStopIds: Map<string, string> = new Map();
  console.log('Inserting stop places...');
  // Need to run these sequentially. Will get transaction errors if trying to do concurrently.
  for (let index = 0; index < seedStopPlaces.length; index++) {
    const stopPoint = seedStopPlaces[index];
    console.log(
      `Stop point ${stopPoint?.label}: stop place insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace(stopPoint);
    collectedStopIds.set(netexRef.label, netexRef.netexId);
    console.log(`Stop point ${stopPoint?.label}: stop place insert finished!`);
  }
  console.log(`Inserted ${seedStopPlaces.length} stop places.`);

  console.log('Inserting stop areas...');
  for (let index = 0; index < seedStopAreas.length; index++) {
    const stopArea = seedStopAreas[index];
    console.log(
      `Stop area ${stopArea?.stopArea.name?.value}: stop area insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    await insertStopArea(stopArea, collectedStopIds);
    console.log(
      `Stop area ${stopArea?.stopArea.name?.value}: stop area insert finished!`,
    );
  }
  console.log(`Inserted ${seedStopAreas.length} stop areas.`);
};

seedStopRegistry();
