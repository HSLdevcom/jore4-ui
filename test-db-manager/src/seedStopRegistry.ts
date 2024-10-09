import {
  buildTerminalCreateInput,
  seedInfoSpots,
  seedOrganisations,
  seedStopAreas,
  seedStopPlaces,
  seedTerminals,
  setInfoSpotRelations,
  setStopAreaRelations,
  setStopPlaceRelations,
} from './datasets';
import {
  insertInfoSpots,
  insertOrganisations,
  insertStopAreas,
  insertStopPlaces,
  insertTerminals,
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

  const terminalCreateInputs = seedTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, collectedStopPlaceIds),
  );
  const terminalUpdateInputs = seedTerminals.map(
    (terminal) => terminal.terminal,
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);

  const infoSpotInputs = seedInfoSpots.map((infoSpot) =>
    setInfoSpotRelations(infoSpot, collectedStopPlaceIds),
  );

  await insertInfoSpots(infoSpotInputs);
};

seedStopRegistry();
