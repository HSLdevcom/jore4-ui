import {
  LineInsertInput,
  RouteInsertInput,
  StopInsertInput,
  StripSerializedTypes,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

/**
 * The generated insert input types allow both Temporal values and their
 * serialized forms, because a part of the test data is passed to the database
 * through `cy.task`, which serializes its arguments with `JSON.stringify`.
 *
 * Spec files build their test data out of Temporal values, so these aliases
 * drop the serialized form and let the specs do date arithmetic on the data
 * they have built.
 */
export type BuiltLineInsertInput = StripSerializedTypes<LineInsertInput>;
export type BuiltRouteInsertInput = StripSerializedTypes<RouteInsertInput>;
export type BuiltStopInsertInput = StripSerializedTypes<StopInsertInput>;
