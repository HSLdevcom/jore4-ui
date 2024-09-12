import {
  GetAllOrganisationIdsResult,
  GetAllStopAreaIdsResult,
  GetAllStopPlaceIdsResult,
  GetInfrastructureLinksByExternalIdsResult,
  OrganisationIdsByName,
  StopAreaIdsByName,
  StopAreaInput,
  StopPlaceDetailsByLabel,
  StopPlaceInput,
  StopRegistryOrganisationInput,
  e2eDatabaseConfig,
  getDbConnection,
  hasuraApi,
  insertOrganisations as insertStopRegistryOrganisations,
  insertStopAreas as insertStopRegistryStopAreas,
  insertStopPlaces as insertStopRegistryStopPlaces,
  mapToDeleteOrganisationMutation,
  mapToDeleteStopAreaMutation,
  mapToDeleteStopPlaceMutation,
  mapToGetAllOrganisationIds,
  mapToGetAllStopAreaIds,
  mapToGetAllStopPlaceIds,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  resetRoutesAndLinesDb,
  setStopAreaRelations,
  setStopPlaceRelations,
  timetablesDatabaseConfig,
} from '@hsl/jore4-test-db-manager';
import {
  HslTimetablesDatasetInput,
  insertHslDataset,
} from '@hsl/timetables-data-inserter';
import * as fs from 'fs';

const jore4db = getDbConnection(e2eDatabaseConfig);
const timetablesDb = getDbConnection(timetablesDatabaseConfig);

export const checkDbConnection = () => {
  // Example about direct access to db
  return (
    jore4db
      .raw('SELECT 1')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        // eslint-disable-next-line no-console
        console.log('PostgreSQL connected', res);
        return res;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        // eslint-disable-next-line no-console
        console.log('PostgreSQL not connected');
        // eslint-disable-next-line no-console
        console.error(e);
        // We have to return undefined instead of throwing an error
        // in order to make test fail if we end up to this code block.
        // https://docs.cypress.io/api/commands/task#Usage
        return undefined;
      })
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeRawDbQuery = ({ query, bindings }: any) => {
  return jore4db.raw(query, bindings);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasuraAPI = (request: any) => {
  return hasuraApi(request);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasuraAPIMultiple = (requests: Array<any>) => {
  return Promise.all(requests.map((r) => hasuraApi(r)));
};

/**
 * Gets infrastuctureLink ids that match given external_link_ids
 * Also returns them in the same order as the external ids were given
 */
export const getInfrastructureLinkIdsByExternalIds = (
  infrastructureLinkExternalIds: string[],
) =>
  hasuraApi(
    mapToGetInfrastructureLinksByExternalIdsQuery(
      infrastructureLinkExternalIds,
    ),
  ).then((res) => {
    return infrastructureLinkExternalIds.map((id) => {
      const typedResult = res as GetInfrastructureLinksByExternalIdsResult;
      const matchingLink =
        typedResult.data.infrastructure_network_infrastructure_link.find(
          (link) => link.external_link_id === id,
        );
      if (!matchingLink) {
        throw new Error(
          `No matching infrastructure link found for external id ${id}`,
        );
      }
      return matchingLink.infrastructure_link_id;
    });
  });

export type InsertedStopRegistryIds = {
  stopAreaIdsByName: StopAreaIdsByName;
  stopPlaceIdsByLabel: StopPlaceIdsByLabel;
  organisationIdsByName: OrganisationIdsByName;
};

export const insertStopRegistryData = async ({
  organisations = [],
  stopAreas = [],
  stopPlaces = [],
}: {
  organisations?: Array<StopRegistryOrganisationInput>;
  stopAreas?: Array<StopAreaInput>;
  stopPlaces?: Array<StopPlaceInput>;
}): Promise<InsertedStopRegistryIds> => {
  const organisationIdsByName =
    await insertStopRegistryOrganisations(organisations);

  const stopPlaceInputs = stopPlaces.map((sp) => {
    return {
      label: sp.label,
      stopPlace: setStopPlaceRelations(sp, organisationIdsByName),
    };
  });
  const stopPlaceIdsByLabel =
    await insertStopRegistryStopPlaces(stopPlaceInputs);

  const stopAreaInputs = stopAreas.map((area) =>
    setStopAreaRelations(area, stopPlaceIdsByLabel),
  );
  const stopAreaIdsByName = await insertStopRegistryStopAreas(stopAreaInputs);

  return { stopAreaIdsByName, stopPlaceIdsByLabel, organisationIdsByName };
};

export const truncateTimetablesDatabase = () => {
  const truncateQuery = fs.readFileSync(
    'fixtures/truncateTimetables/truncateTimetables.sql',
    'utf8',
  );
  return timetablesDb.raw(truncateQuery);
};

export const getAllStopPlaceIds = () => {
  return hasuraAPI(mapToGetAllStopPlaceIds());
};

export const getAllStopAreaIds = () => {
  return hasuraAPI(mapToGetAllStopAreaIds());
};

export const getAllOrganisationIds = () => {
  return hasuraAPI(mapToGetAllOrganisationIds());
};

const deleteStopPlaces = async () => {
  const stopPlaceIdsResult =
    (await getAllStopPlaceIds()) as GetAllStopPlaceIdsResult;

  const stopPlaceIds =
    stopPlaceIdsResult.data.stops_database.stops_database_stop_place.map(
      (stopPlace) => stopPlace.netex_id,
    );

  return hasuraAPIMultiple(
    stopPlaceIds.map((stopPlaceId) =>
      mapToDeleteStopPlaceMutation(stopPlaceId),
    ),
  );
};

const deleteStopAreas = async () => {
  const stopAreaIdsResult =
    (await getAllStopAreaIds()) as GetAllStopAreaIdsResult;

  const stopAreaIds =
    stopAreaIdsResult.data.stops_database.stops_database_group_of_stop_places.map(
      (stopArea) => stopArea.netex_id,
    );

  return hasuraAPIMultiple(
    stopAreaIds.map((stopAreaId) => mapToDeleteStopAreaMutation(stopAreaId)),
  );
};

const deleteOrganisations = async () => {
  const organisationIdsResult =
    (await getAllOrganisationIds()) as GetAllOrganisationIdsResult;

  const organisationIds =
    organisationIdsResult.data.stops_database.stops_database_organisation.map(
      (organisation) => organisation.netex_id,
    );

  return hasuraAPIMultiple(
    organisationIds.map((organisationId) =>
      mapToDeleteOrganisationMutation(organisationId),
    ),
  );
};

export const resetStopRegistryDb = async () => {
  await deleteStopAreas();
  await deleteStopPlaces();
  await deleteOrganisations();
};

export const resetDbs = async () => {
  return Promise.all([
    resetStopRegistryDb(),
    resetRoutesAndLinesDb(jore4db),
    truncateTimetablesDatabase(),
  ]);
};

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    return fs.unlinkSync(filePath);
  }
  return new Error(`File ${filePath} does not exist`);
};

export const insertHslTimetablesDatasetToDb = (
  input: HslTimetablesDatasetInput,
) => {
  const builtDataset = insertHslDataset(input, timetablesDatabaseConfig);
  return builtDataset;
};

export const emptyDownloadsFolder = () => {
  const downloadsFolder = 'downloads';
  fs.readdirSync(downloadsFolder).forEach((file) => {
    deleteFile(`${downloadsFolder}/${file}`);
  });
  return true;
};
