/* eslint-disable no-console */
import {
  StopAreaInput,
  StopPlaceInput,
  StopPlaceMaintenance,
  StopPlaceNetexRef,
  seedOrganisations,
  seedOrganisationsByLabel,
  seedStopAreas,
  seedStopPlaces,
} from './datasets';
import {
  StopRegistryOrganisationInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
  StopRegistryVersionLessEntityRefInput,
} from './generated/graphql';
import { insertStopPlaceForScheduledStopPoint } from './graphql-helpers';
import { hasuraApi } from './hasuraApi';
import {
  mapToInsertOrganisationMutation,
  mapToInsertStopAreaMutation,
} from './queries';
import { mapToGetStopPointByLabelQuery } from './queries/routesAndLines';
import {
  GetStopPointByLabelResult,
  InsertOrganisationResult,
  InsertStopAreaResult,
} from './types';
import { isNotNullish } from './utils';

const insertOrganisation = async (
  organisation: StopRegistryOrganisationInput,
) => {
  try {
    const returnValue = (await hasuraApi(
      mapToInsertOrganisationMutation(organisation),
    )) as InsertOrganisationResult;

    if (returnValue.data == null) {
      throw new Error('Null data returned from Tiamat');
    }

    return returnValue.data.stop_registry.mutateOrganisation[0];
  } catch (error) {
    console.error(
      'An error occurred while inserting organisation!',
      organisation.name,
      error,
    );
    throw error;
  }
};

const mapStopPlaceMaintenanceToInput = (
  maintenance: StopPlaceMaintenance | null,
  organisationIdsByLabel: Map<string, string>,
): Array<StopRegistryStopPlaceOrganisationRef> | undefined => {
  if (!maintenance) {
    return undefined;
  }

  const organisationRefs: Array<StopRegistryStopPlaceOrganisationRef> =
    Object.entries(maintenance)
      .map(([key, organisationLabel]) => {
        if (!organisationLabel) {
          return null;
        }

        const organisationName =
          seedOrganisationsByLabel[organisationLabel]?.name;
        const maintenanceOrganisationId =
          organisationIdsByLabel.get(organisationName);
        if (!maintenanceOrganisationId) {
          throw new Error(
            `Could not find organisation with label ${organisationLabel}`,
          );
        }

        return {
          organisationRef: maintenanceOrganisationId,
          relationshipType:
            key as StopRegistryStopPlaceOrganisationRelationshipType,
        };
      })
      .filter(isNotNullish);

  return organisationRefs;
};

const insertStopPlace = async (
  { label, maintenance, stopPlace }: StopPlaceInput,
  organisationIdsByLabel: Map<string, string>,
): Promise<StopPlaceNetexRef> => {
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
    const stopPlaceForInsert = {
      ...stopPlace,
      organisations: mapStopPlaceMaintenanceToInput(
        maintenance,
        organisationIdsByLabel,
      ),
    };

    const stopPlaceRef = await insertStopPlaceForScheduledStopPoint(
      stopPointId,
      stopPlaceForInsert,
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
  const collectedOrganisationIds: Map<string, string> = new Map();
  console.log('Inserting organisations...');
  // Need to run these sequentially. Will get transaction errors if trying to do concurrently.
  for (let index = 0; index < seedOrganisations.length; index++) {
    const organisation = seedOrganisations[index];
    console.log(
      `Organisation ${organisation.name}: organisation insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const result = await insertOrganisation(organisation);
    collectedOrganisationIds.set(result.name, result.id);
    console.log(
      `Organisation ${organisation.name}: organisation insert finished!`,
    );
  }
  console.log(`Inserted ${seedOrganisations.length} organisations.`);
  console.log('Seed organisation ids: ', collectedOrganisationIds);

  const collectedStopIds: Map<string, string> = new Map();
  console.log('Inserting stop places...');
  for (let index = 0; index < seedStopPlaces.length; index++) {
    const stopPoint = seedStopPlaces[index];
    console.log(
      `Stop point ${stopPoint?.label}: stop place insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace(stopPoint, collectedOrganisationIds);
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
