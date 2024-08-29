import { seedOrganisations, seedStopAreas, seedStopPlaces } from './datasets';
import {
  insertOrganisations,
  insertStopAreas,
  insertStopPlaces,
} from './graphql-helpers';

const seedStopRegistry = async () => {
  const collectedOrganisationIds = await insertOrganisations(seedOrganisations);
  const collectedStopIds = await insertStopPlaces(
    seedStopPlaces,
    collectedOrganisationIds,
  );
  await insertStopAreas(seedStopAreas, collectedStopIds);
};

seedStopRegistry();
