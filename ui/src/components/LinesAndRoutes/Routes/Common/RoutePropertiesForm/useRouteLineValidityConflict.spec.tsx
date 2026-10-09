import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import { renderHook, waitFor } from '@testing-library/react';
import { DateTime } from 'luxon';
import { GetSelectedLineDetailsByIdDocument } from '../../../../../generated/graphql';
import { useRouteLineValidityConflict } from './useRouteLineValidityConflict';

const lineId = 'line1';

// Line 2 is valid indefinitely from the start until 2030-01-01.
const unboundedStartLineId = 'line2';

// Line 1 is valid 2020-01-01 - 2030-01-01.
const mocks: ReadonlyArray<MockedResponse> = [
  {
    request: {
      query: GetSelectedLineDetailsByIdDocument,
      variables: { line_id: lineId },
    },
    result: {
      data: {
        route_line_by_pk: {
          __typename: 'route_line',
          line_id: lineId,
          label: '1',
          name_i18n: buildLocalizedString('Line1 name'),
          validity_start: DateTime.fromISO('2020-01-01'),
          validity_end: DateTime.fromISO('2030-01-01'),
        },
      },
    },
  },
  {
    request: {
      query: GetSelectedLineDetailsByIdDocument,
      variables: { line_id: unboundedStartLineId },
    },
    result: {
      data: {
        route_line_by_pk: {
          __typename: 'route_line',
          line_id: unboundedStartLineId,
          label: '2',
          name_i18n: buildLocalizedString('Line2 name'),
          validity_start: null,
          validity_end: DateTime.fromISO('2030-01-01'),
        },
      },
    },
  },
];

function renderConflictHook(
  params: Parameters<typeof useRouteLineValidityConflict>[0],
) {
  return renderHook(() => useRouteLineValidityConflict(params), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });
}

describe('useRouteLineValidityConflict', () => {
  test('should not throw when the end date is cleared and indefinite is false', async () => {
    const { result } = renderConflictHook({
      onLineId: lineId,
      validityStart: '2021-01-01',
      validityEnd: '',
      indefinite: false,
    });

    await waitFor(() => expect(result.current.line).toBeDefined());

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not throw when indefinite is unchecked while the end date is empty', async () => {
    const { result } = renderConflictHook({
      onLineId: lineId,
      validityStart: '2021-01-01',
      validityEnd: undefined,
      indefinite: false,
    });

    await waitFor(() => expect(result.current.line).toBeDefined());

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the route ends after the line', async () => {
    const { result } = renderConflictHook({
      onLineId: lineId,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    await waitFor(() => expect(result.current.hasConflict).toBe(true));
  });

  test('should not report a conflict when the route is inside the line validity', async () => {
    const { result } = renderConflictHook({
      onLineId: lineId,
      validityStart: '2021-01-01',
      validityEnd: '2025-01-01',
      indefinite: false,
    });

    await waitFor(() => expect(result.current.line).toBeDefined());

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the route ends after a line with an unbounded start', async () => {
    const { result } = renderConflictHook({
      onLineId: unboundedStartLineId,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    await waitFor(() => expect(result.current.hasConflict).toBe(true));
  });
});
