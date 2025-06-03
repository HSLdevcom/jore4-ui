import { buildTerminalCreateInput, seedLocalTerminals } from './datasets';
import { fetchStopPlaceIdsAndLabels, insertTerminals } from './graphql-helpers';

const seedStopRegistryTerminals = async () => {
  const stopIds = await fetchStopPlaceIdsAndLabels();

  const terminalCreateInputs = seedLocalTerminals.map((terminal) =>
    buildTerminalCreateInput(terminal, stopIds),
  );
  const terminalUpdateInputs = seedLocalTerminals.map(
    (terminal) => terminal.terminal,
  );
  await insertTerminals(terminalCreateInputs, terminalUpdateInputs);
};

seedStopRegistryTerminals();
