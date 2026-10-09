import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import { renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import { LineForComboboxFragment } from '../../../../../generated/graphql';
import { useRouteLineValidityConflict } from './useRouteLineValidityConflict';

// Line 1 is valid 2020-01-01 - 2030-01-01.
const line: LineForComboboxFragment = {
  __typename: 'route_line',
  line_id: 'line1',
  label: '1',
  name_i18n: buildLocalizedString('Line1 name'),
  validity_start: DateTime.fromISO('2020-01-01'),
  validity_end: DateTime.fromISO('2030-01-01'),
};

// Line 2 is valid indefinitely from the start until 2030-01-01.
const unboundedStartLine: LineForComboboxFragment = {
  ...line,
  line_id: 'line2',
  label: '2',
  name_i18n: buildLocalizedString('Line2 name'),
  validity_start: null,
};

function renderConflictHook(
  params: Parameters<typeof useRouteLineValidityConflict>[0],
) {
  return renderHook(() => useRouteLineValidityConflict(params));
}

describe('useRouteLineValidityConflict', () => {
  test('should not report a conflict when the end date is cleared and indefinite is false', () => {
    const { result } = renderConflictHook({
      line,
      validityStart: '2021-01-01',
      validityEnd: '',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when indefinite is unchecked while the end date is empty', () => {
    const { result } = renderConflictHook({
      line,
      validityStart: '2021-01-01',
      validityEnd: undefined,
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when no line is selected', () => {
    const { result } = renderConflictHook({
      line: null,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the route ends after the line', () => {
    const { result } = renderConflictHook({
      line,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should not report a conflict when the route is inside the line validity', () => {
    const { result } = renderConflictHook({
      line,
      validityStart: '2021-01-01',
      validityEnd: '2025-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the route ends after a line with an unbounded start', () => {
    const { result } = renderConflictHook({
      line: unboundedStartLine,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });
});
