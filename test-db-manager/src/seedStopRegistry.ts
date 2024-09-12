import {
  seedInfoSpots,
  seedOrganisations,
  seedStopAreas,
  seedStopPlaces,
  setStopAreaRelations,
  setStopPlaceRelations,
} from './datasets';
import {
  insertInfoSpots,
  insertOrganisations,
  insertStopAreas,
  insertStopPlaces,
} from './graphql-helpers';

const seedStopRegistry = async () => {
  const collectedOrganisationIds = await insertOrganisations(seedOrganisations);

  const stopPlaceInputs = seedStopPlaces.map((sp) => {
    return {
      label: sp.label,
      stopPlace: setStopPlaceRelations(sp, collectedOrganisationIds),
    };
  });
  const collectedStopPlaceIds = await insertStopPlaces(stopPlaceInputs);

  const stopAreaInputs = seedStopAreas.map((area) =>
    setStopAreaRelations(area, collectedStopPlaceIds),
  );
  await insertStopAreas(stopAreaInputs);

  await insertInfoSpots(seedInfoSpots);
};

seedStopRegistry();
