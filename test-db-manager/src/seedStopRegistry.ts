import {
  buildTerminalCreateInput,
  seedInfoSpots,
  seedOrganisations,
  seedQuays,
  seedStopAreas,
  seedTerminals,
  setInfoSpotRelations,
  setStopPlaceOrganisations,
} from './datasets';
import { StopRegistryStopPlaceInput } from './generated/graphql';
import {
  insertInfoSpots,
  insertOrganisations,
  insertStopPlaces,
  insertTerminals,
} from './graphql-helpers';

const seedStopRegistry = async () => {
  const collectedOrganisationIds = await insertOrganisations(seedOrganisations);

  const stopPlacesWithOrganisations = seedStopAreas.map((sa) =>
    setStopPlaceOrganisations(sa, collectedOrganisationIds),
  );

  const stopPlaceInputs: Array<Partial<StopRegistryStopPlaceInput>> =
    seedQuays.map((quay) => {
      if (quay.stopArea) {
        return {
          ...stopPlacesWithOrganisations.find(
            (sp) => sp.publicCode === quay.stopArea,
          ),
          quays: [quay.quay],
        };
      }
      return {
        name: quay.quay.name,
        quays: [quay.quay],
      };
    });

  const collectedStopPlaceIds = await insertStopPlaces(stopPlaceInputs);

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
