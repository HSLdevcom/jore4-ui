// graphql schema uses snake_case instead of camelCase
/* eslint-disable camelcase */
import {
  buildLine,
  buildRoute,
  Priority,
  RouteDirectionEnum,
  RouteLineInsertInput,
} from '@hsl/jore4-test-db-manager';
import { act, renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import {
  insertToDbHelper,
  mockApolloLink,
  removeFromDbHelper,
  renderOptions,
} from '../utils/test-utils/integration-tests';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

jest.mock('apollo-link-scalars', () => ({
  withScalars: () => mockApolloLink,
}));
jest.mock('graphql', () => ({
  buildClientSchema: jest.fn(),
}));

// custom typings for lines to be used in this test suite to avoid
// TS errors due to TS interpreting everything in `RouteLineInsertInput`
// type to be Maybe<> and optional
type TestLine = RouteLineInsertInput & {
  label: string;
  validity_start?: DateTime;
  validity_end?: DateTime;
  line_id: UUID;
  priority: Priority;
};

const indefiniteLine = {
  ...buildLine({ label: 'indefinite' }),
  line_id: 'c23b4134-5098-4cda-9eec-d393001580c3',
} as TestLine;
const indefiniteEndLine = {
  ...buildLine({ label: 'indefiniteEnd' }),
  line_id: '1ba4e1c8-63b1-4a4f-8658-0c34cfa80b62',
  validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+02:00'),
} as TestLine;
const indefiniteStartLine = {
  ...buildLine({ label: 'indefiniteStart' }),
  line_id: '3c6d03a9-9f7f-49dc-b125-506d0eab1854',
  validity_end: DateTime.fromISO('2022-08-11T13:08:43.315+02:00'),
} as TestLine;
const boundedLine = {
  ...buildLine({ label: 'bounded' }),
  line_id: 'cb427403-696c-46a6-b1f8-a54ef189fb17',
  validity_start: DateTime.fromISO('2022-01-01T13:08:43.315+02:00'),
  validity_end: DateTime.fromISO('2022-01-31T13:08:43.315+02:00'),
} as TestLine;
const draftLine = {
  ...buildLine({ label: 'draft' }),
  line_id: 'b3734679-1a15-412f-b3ce-1deeade51e89',
  validity_start: DateTime.fromISO('2022-02-01T13:08:43.315+02:00'),
  validity_end: DateTime.fromISO('2023-02-28T13:08:43.315+02:00'),
  priority: Priority.Draft,
} as TestLine;

const lines: TestLine[] = [
  indefiniteLine,
  indefiniteStartLine,
  indefiniteEndLine,
  boundedLine,
  draftLine,
];

const inboundRoute = {
  ...buildRoute({ label: 'inboundRoute' }),
  route_id: '4415f493-f170-4540-8753-fe5c3835ad8a',
  direction: RouteDirectionEnum.Inbound,
  on_line_id: indefiniteLine.line_id,
};

const routes = [inboundRoute];

const dbResources = {
  lines,
  routes,
};

const buildQuery = ({
  label,
  validityStart,
  validityEnd,
  priority = Priority.Standard,
}: {
  label: string;
  validityStart?: DateTime;
  validityEnd?: DateTime;
  priority?: Priority;
}) => ({
  label,
  priority,
  validityStart,
  validityEnd,
});

const deleteCreatedResources = () => removeFromDbHelper(dbResources);

describe(`${useCheckValidityAndPriorityConflicts.name}()`, () => {
  beforeAll(async () => {
    await deleteCreatedResources();
    await insertToDbHelper(dbResources);
  });

  afterAll(async () => {
    await deleteCreatedResources();
  });

  const { result } = renderHook(
    useCheckValidityAndPriorityConflicts,
    renderOptions,
  );

  describe('Indefinite resources (validity_start and validity_end both null)', () => {
    test('Should return conflict on two resources with indefinite validity', async () => {
      await act(async () => {
        const conflicts = await result.current.getConflictingLines(
          buildQuery({ label: indefiniteLine.label }),
        );
        expect(conflicts.length).toBe(1);
      });
    });
    test('Should return conflict on bounded resource within existsting indefinite resource', async () => {
      await act(async () => {
        const conflicts = await result.current.getConflictingLines(
          buildQuery({
            label: indefiniteLine.label,
            validityStart: DateTime.fromISO('2022-01-01T13:08:43.315+02:00'),
            validityEnd: DateTime.fromISO('2023-01-31T13:08:43.315+02:00'),
          }),
        );
        expect(conflicts.length).toBe(1);
      });
    });
  });

  test('Should return conflict on resources with same validity_start', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: indefiniteEndLine.label,
          validityStart: indefiniteEndLine.validity_start,
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should return conflict on resources with same validity_end', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: indefiniteStartLine.label,
          validityEnd: indefiniteStartLine.validity_end,
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should return conflict on resource within existing instance of resource', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_start?.plus({ milliseconds: 1 }),
          validityEnd: boundedLine.validity_end?.minus({ milliseconds: 1 }),
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should return conflict on resource starting before and ending after existing version', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_start?.minus({
            milliseconds: 1,
          }),
          validityEnd: boundedLine.validity_end?.plus({ millisecond: 1 }),
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should not allow new version after current version when bounds overlap', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_end,
          validityEnd: undefined,
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should allow new version after current version, bounds not overlapping, validity_end null', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_end?.plus({ milliseconds: 1 }),
          validityEnd: undefined,
        }),
      );
      expect(conflicts.length).toBe(0);
    });
  });

  test('Should allow new version after current version, bounds not overlapping, validity_end defined', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_end?.plus({ milliseconds: 1 }),
          validityEnd: boundedLine.validity_end?.plus({ months: 1 }),
        }),
      );
      expect(conflicts.length).toBe(0);
    });
  });

  test('Should not allow new version before current version when bounds overlap', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: undefined,
          validityEnd: boundedLine.validity_start,
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should allow new version before current version, bounds not overlapping, validity_start defined', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: boundedLine.validity_start?.minus({ days: 1 }),
          validityEnd: boundedLine.validity_start?.minus({ milliseconds: 1 }),
        }),
      );
      expect(conflicts.length).toBe(0);
    });
  });

  test('Should allow new version before current version, bounds not overlapping, validity_start null', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          label: boundedLine.label,
          validityStart: undefined,
          validityEnd: boundedLine.validity_start?.minus({ milliseconds: 1 }),
        }),
      );
      expect(conflicts.length).toBe(0);
    });
  });

  describe('Special cases', () => {
    test('Should allow creating conflicting version with new priority', async () => {
      await act(async () => {
        const conflicts = await result.current.getConflictingLines(
          buildQuery({
            label: boundedLine.label,
            validityStart: boundedLine.validity_start,
            validityEnd: boundedLine.validity_end,
            priority: Priority.Temporary,
          }),
        );
        expect(conflicts.length).toBe(0);
      });
    });

    test('Should allow creating conflicting version with draft priority', async () => {
      await act(async () => {
        const conflicts = await result.current.getConflictingLines(
          buildQuery({
            label: draftLine.label,
            validityStart: draftLine.validity_start,
            validityEnd: draftLine.validity_end,
            priority: draftLine.priority,
          }),
        );
        expect(conflicts.length).toBe(0);
      });
    });

    test('Should allow creating conflicting version of the resource itself (=with same id). (Otherwise resources could not be edited. Conflicts do not matter in this case as we are *overwriting* conflicting version)', async () => {
      await act(async () => {
        const conflicts = await result.current.getConflictingLines(
          buildQuery({
            label: boundedLine.label,
            validityStart: boundedLine.validity_start,
            validityEnd: boundedLine.validity_end,
          }),
          boundedLine.line_id,
        );
        expect(conflicts.length).toBe(0);
      });
    });

    describe('Routes', () => {
      test('Does not allow creating conflicting route with same direction', async () => {
        await act(async () => {
          const conflicts = await result.current.getConflictingRoutes({
            ...buildQuery({
              label: inboundRoute.label,
            }),
            direction: RouteDirectionEnum.Inbound,
          });
          expect(conflicts.length).toBe(1);
        });
      });

      test('Allow creating conflicting route with opposite direction', async () => {
        await act(async () => {
          const conflicts = await result.current.getConflictingRoutes({
            ...buildQuery({
              label: inboundRoute.label,
            }),
            direction: RouteDirectionEnum.Outbound,
          });
          expect(conflicts.length).toBe(0);
        });
      });
    });
  });
});
