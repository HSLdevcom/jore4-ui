import {
  OrganisationIdsByName,
  QuayDetailsByLabel,
  StopPlaceIdsByName,
  TerminalIdsByName,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

// Keep in sync with cypress/support/tasks.ts
// We need 2 versions, as while the types are identical, they are imported
// from different versions of tests-db-manager.
export type InsertedStopRegistryIds = {
  terminalsByName: TerminalIdsByName;
  stopPlaceIdsByName: StopPlaceIdsByName;
  quayDetailsByLabel: QuayDetailsByLabel;
  organisationIdsByName: OrganisationIdsByName;
};
