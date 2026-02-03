import {
  seedOrganisations,
  seedTramStopAreas,
  setStopPlaceOrganisations,
} from './datasets';
import { insertOrganisations, insertStopPlaces } from './graphql-helpers';

export const seedStopRegistryTrams = async () => {
  const collectedOrganisationIds = await insertOrganisations(seedOrganisations);

  const stopPlacesWithOrganisations = seedTramStopAreas.map((sa) =>
    setStopPlaceOrganisations(sa, collectedOrganisationIds),
  );

  const stopPlaceInputs = stopPlacesWithOrganisations.map((sp) => ({
    ...sp,
    quays: [],
  }));

  await insertStopPlaces(stopPlaceInputs, true);
};
