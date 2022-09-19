// graphql schema uses snake_case instead of camelCase
/* eslint-disable camelcase */
import { buildLine, Priority } from '@hsl/jore4-test-db-manager';
import { act, renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import { OptionalKeys } from '../types';
import {
  insertToDbHelper,
  mockApolloLink,
  removeFromDbHelper,
  renderOptions,
} from '../utils/test-utils/integration-tests';
import {
  CommonParams,
  useCheckValidityAndPriorityConflicts,
} from './useCheckValidityAndPriorityConflicts';

jest.mock('apollo-link-scalars', () => ({
  withScalars: () => mockApolloLink,
}));
jest.mock('graphql', () => ({
  buildClientSchema: jest.fn(),
}));

const lines = [
  {
    ...buildLine({ label: 'indefinite' }),
    line_id: 'c23b4134-5098-4cda-9eec-d393001580c3',
  },
  {
    ...buildLine({ label: '65x' }),
    line_id: 'cb427403-696c-46a6-b1f8-a54ef189fb17',
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
];

const dbResources = {
  lines,
};

const buildQuery = ({
  label,
  validityStart,
  validityEnd,
  priority = Priority.Standard,
}: OptionalKeys<CommonParams, 'priority'>) => ({
  label,
  priority,
  validityStart,
  validityEnd,
});

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

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

  test('Should return conflict on resources with same validity_start', async () => {
    await act(async () => {
      const line = lines[1];
      const { label, validity_start } = line;
      const conflicts = await result.current.getConflictingLines(
        buildQuery({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          label: label!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          validityStart: validity_start!,
        }),
      );
      expect(conflicts.length).toBe(1);
    });
  });

  test('Should return conflict on two resources with indefinite validity', async () => {
    await act(async () => {
      const conflicts = await result.current.getConflictingLines(
        buildQuery({ label: 'indefinite' }),
      );
      expect(conflicts.length).toBe(1);
    });
  });
});
