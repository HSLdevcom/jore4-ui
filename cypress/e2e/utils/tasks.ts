import {
  GetAllOrganisationIdsResult,
  GetAllStopAreaIdsResult,
  GetInfrastructureLinksByExternalIdsResult,
  InfoSpotInput,
  OrganisationIdsByName,
  StopAreaIdsByName,
  StopAreaInput,
  StopPlaceDetailsByLabel,
  StopPlaceInput,
  StopRegistryOrganisationInput,
  TerminalIdsByName,
  buildTerminalCreateInput,
  e2eDatabaseConfig,
  getDbConnection,
  hasuraApi,
  insertInfoSpots as insertStopRegistryInfoSpots,
  insertOrganisations as insertStopRegistryOrganisations,
  insertStopAreas as insertStopRegistryStopAreas,
  insertStopPlaces as insertStopRegistryStopPlaces,
  insertTerminals,
  mapToDeleteOrganisationMutation,
  mapToDeleteStopAreaMutation,
  mapToGetAllOrganisationIds,
  mapToGetAllStopAreaIds,
  mapToGetAllStopPlaceIds,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  resetRoutesAndLinesDb,
  setInfoSpotRelations,
  setStopAreaRelations,
  setStopPlaceRelations,
  stopsDatabaseConfig,
  timetablesDatabaseConfig,
} from '@hsl/jore4-test-db-manager';
import { TerminalInput } from '@hsl/jore4-test-db-manager/dist/types/datasets/stopRegistry/terminals';
import {
  HslTimetablesDatasetInput,
  insertHslDataset,
} from '@hsl/timetables-data-inserter';
import * as fs from 'fs';

const jore4db = getDbConnection(e2eDatabaseConfig);
const timetablesDb = getDbConnection(timetablesDatabaseConfig);
const stopsDb = getDbConnection(stopsDatabaseConfig);

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
  terminalsByName: TerminalIdsByName;
  stopAreaIdsByName: StopAreaIdsByName;
  stopPlaceDetailsByLabel: StopPlaceDetailsByLabel;
  organisationIdsByName: OrganisationIdsByName;
};

export const insertStopRegistryData = async ({
  organisations = [],
  terminals = [],
  stopAreas = [],
  stopPlaces = [],
  infoSpots = [],
}: {
  organisations?: Array<StopRegistryOrganisationInput>;
  terminals?: Array<TerminalInput>;
  stopAreas?: Array<StopAreaInput>;
  stopPlaces?: Array<StopPlaceInput>;
  infoSpots?: Array<InfoSpotInput>;
}): Promise<InsertedStopRegistryIds> => {
  const organisationIdsByName =
    await insertStopRegistryOrganisations(organisations);

  const stopPlaceInputs = stopPlaces.map((sp) => {
    return {
      label: sp.label,
      stopPlace: setStopPlaceRelations(sp, organisationIdsByName),
    };
  });
  const stopPlaceDetailsByLabel =
    await insertStopRegistryStopPlaces(stopPlaceInputs);

  const infoSpotInputs = infoSpots.map((spot) =>
    setInfoSpotRelations(spot, stopPlaceDetailsByLabel),
  );
  await insertStopRegistryInfoSpots(infoSpotInputs);

  const stopAreaInputs = stopAreas.map((area) =>
    setStopAreaRelations(area, stopPlaceDetailsByLabel),
  );
  const stopAreaIdsByName = await insertStopRegistryStopAreas(stopAreaInputs);

  const terminalCreateInputs = terminals.map((terminal) =>
    buildTerminalCreateInput(terminal, stopPlaceDetailsByLabel),
  );
  const terminalUpdateInputs = terminals.map((terminal) => terminal.terminal);
  const terminalsByName = await insertTerminals(
    terminalCreateInputs,
    terminalUpdateInputs,
  );

  return {
    terminalsByName,
    stopAreaIdsByName,
    stopPlaceDetailsByLabel,
    organisationIdsByName,
  };
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

const deleteStopPlacesAndTerminals = async () => {
  const truncateQuery = fs.readFileSync(
    'fixtures/truncateStopPlaces.sql',
    'utf8',
  );
  return stopsDb.raw(truncateQuery);
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
  await deleteStopPlacesAndTerminals();
  await deleteOrganisations();
  // TODO: Add deletion of info spots
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
