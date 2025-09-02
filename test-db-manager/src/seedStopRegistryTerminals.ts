import {
  buildTerminalCreateInput,
  buildTerminalUpdateInput,
  mapTerminalOwnersToOrganisations,
  seedLocalTerminals,
  seedOrganisations,
} from './datasets';
import {
  fetchStopPlaceIdsAndLabels,
  insertOrganisations,
  insertTerminals,
} from './graphql-helpers';

const seedStopRegistryTerminals = async () => {
  const collectedOrganisationIds = await insertOrganisations(
    seedOrganisations.concat(
      mapTerminalOwnersToOrganisations(seedLocalTerminals),
    ),
  );
  const stopIds = await fetchStopPlaceIdsAndLabels();

  const terminalCreateInputs = seedLocalTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, stopIds),
  );
  const terminalUpdateInputs = seedLocalTerminals.map((terminal) =>
    buildTerminalUpdateInput(terminal, collectedOrganisationIds),
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);
};

seedStopRegistryTerminals();
