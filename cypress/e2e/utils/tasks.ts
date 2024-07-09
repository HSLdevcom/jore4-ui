import {
  GetAllStopPlaceIdsResult,
  GetInfrastructureLinksByExternalIdsResult,
  StopInsertInput,
  StopRegistryStopPlace,
  e2eDatabaseConfig,
  getDbConnection,
  hasuraApi,
  insertStopPlaceForScheduledStopPoint,
  mapToDeleteStopPlaceMutation,
  mapToGetAllStopPlaceIds,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  resetRoutesAndLinesDb,
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

/**
 * Inserts stop place for each stop point.
 * The scheduled stop points and stop places are matched by index.
 */
export const insertStopPlaces = async ({
  scheduledStopPoints,
  stopPlaces,
}: {
  scheduledStopPoints: Array<StopInsertInput>;
  stopPlaces: Array<Partial<StopRegistryStopPlace>>;
}): Promise<Array<string>> => {
  if (scheduledStopPoints.length !== stopPlaces.length) {
    throw new Error(
      'insertStopPlaces should be called with same amount of scheduled stop points and stop places',
    );
  }

  const stopPlaceIds: Array<string> = [];
  for (let index = 0; index < scheduledStopPoints.length; index++) {
    const scheduledStopPoint = scheduledStopPoints[index];
    const stopPlace = stopPlaces[index];

    // eslint-disable-next-line no-await-in-loop
    const stopPlaceId = await insertStopPlaceForScheduledStopPoint(
      scheduledStopPoint.scheduled_stop_point_id,
      stopPlace,
    );
    stopPlaceIds.push(stopPlaceId);
  }

  return stopPlaceIds;
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

export const resetDbs = async () => {
  const stopPlaceIdsResult =
    (await getAllStopPlaceIds()) as GetAllStopPlaceIdsResult;

  const stopPlaceIds =
    stopPlaceIdsResult.data.stops_database.stops_database_stop_place.map(
      (scheduledStopPoint) => scheduledStopPoint.netex_id,
    );

  return Promise.all([
    hasuraAPIMultiple(
      stopPlaceIds.map((stopPlaceId) =>
        mapToDeleteStopPlaceMutation(stopPlaceId),
      ),
    ),
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
