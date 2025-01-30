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
            (sp) => sp.privateCode?.value === quay.stopArea,
          ),
          quays: [quay.quay],
        };
      }
      return {
        name: { value: quay.quay.publicCode },
        publicCode: quay.quay.publicCode,
        quays: [quay.quay],
      };
    });

  const { collectedStopIds, collectedQuayDetails } =
    await insertStopPlaces(stopPlaceInputs);

  const terminalCreateInputs = seedTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, collectedStopIds),
  );
  const terminalUpdateInputs = seedTerminals.map(
    (terminal) => terminal.terminal,
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);

  const infoSpotInputs = seedInfoSpots.map((infoSpot) =>
    setInfoSpotRelations(infoSpot, collectedQuayDetails),
  );

  await insertInfoSpots(infoSpotInputs);
};

seedStopRegistry();
