import { renderHook } from '@testing-library/react';
import compact from 'lodash/compact';
import { EnrichedStopPlace } from '../../../../types';
import { KnownValueKey } from '../../../../utils';
import { useMemberStopsValidityConflict } from './useMemberStopsValidityConflict';

function buildMemberStop(
  publicCode: string,
  validityStart: string | null,
  validityEnd: string | null,
) {
  return {
    publicCode,
    keyValues: compact([
      validityStart
        ? { key: KnownValueKey.ValidityStart, values: [validityStart] }
        : null,
      validityEnd
        ? { key: KnownValueKey.ValidityEnd, values: [validityEnd] }
        : null,
    ]),
  };
}

function buildStopArea(
  quays: ReadonlyArray<ReturnType<typeof buildMemberStop>>,
  validity: { validityStart?: string; validityEnd?: string } = {},
): EnrichedStopPlace {
  return { quays, ...validity } as EnrichedStopPlace;
}

// Stop area is valid 2020-01-01 - 2030-01-01 and its member stop
// 2021-01-01 - 2025-01-01.
const area = buildStopArea(
  [buildMemberStop('H1234', '2021-01-01', '2025-01-01')],
  { validityStart: '2020-01-01', validityEnd: '2030-01-01' },
);

// Member stop is valid indefinitely from 2021-01-01 onwards.
const areaWithIndefiniteMemberStop = buildStopArea(
  [buildMemberStop('H1234', '2021-01-01', null)],
  { validityStart: '2020-01-01', validityEnd: '2030-01-01' },
);

function renderConflictHook(
  params: Parameters<typeof useMemberStopsValidityConflict>[0],
) {
  return renderHook(() => useMemberStopsValidityConflict(params));
}

describe('useMemberStopsValidityConflict', () => {
  test('should not report a conflict when the end date is cleared and indefinite is false', () => {
    const { result } = renderConflictHook({
      area,
      validityStart: '2022-01-01',
      validityEnd: '',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when no stop area is given', () => {
    const { result } = renderConflictHook({
      area: null,
      validityStart: '2022-01-01',
      validityEnd: '2023-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when the stop area has no member stops', () => {
    const { result } = renderConflictHook({
      area: buildStopArea([]),
      validityStart: '2022-01-01',
      validityEnd: '2023-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when the member stops fit inside the stop area validity', () => {
    const { result } = renderConflictHook({
      area,
      validityStart: '2019-01-01',
      validityEnd: '2031-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when the validity period is unchanged', () => {
    const { result } = renderConflictHook({
      area: areaWithIndefiniteMemberStop,
      validityStart: '2020-01-01',
      validityEnd: '2030-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the stop area starts after a member stop', () => {
    const { result } = renderConflictHook({
      area,
      validityStart: '2022-01-01',
      validityEnd: '2030-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
    expect(result.current.conflictingMemberStops).toEqual([
      {
        publicCode: 'H1234',
        validityStart: Temporal.PlainDate.from('2021-01-01'),
        validityEnd: Temporal.PlainDate.from('2025-01-01'),
      },
    ]);
  });

  test('should report a conflict when the stop area ends before a member stop', () => {
    const { result } = renderConflictHook({
      area,
      validityStart: '2020-01-01',
      validityEnd: '2024-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should report a conflict when the stop area ends but a member stop is indefinite', () => {
    const { result } = renderConflictHook({
      area: areaWithIndefiniteMemberStop,
      validityStart: '2020-01-01',
      validityEnd: '2029-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should not report a conflict when the stop area is indefinite', () => {
    const { result } = renderConflictHook({
      area: areaWithIndefiniteMemberStop,
      validityStart: '2020-01-01',
      validityEnd: '',
      indefinite: true,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should ignore member stops without a validity start', () => {
    const { result } = renderConflictHook({
      area: buildStopArea([buildMemberStop('H1234', null, '2040-01-01')]),
      validityStart: '2020-01-01',
      validityEnd: '2030-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report only the member stops that are in conflict', () => {
    const { result } = renderConflictHook({
      area: buildStopArea([
        buildMemberStop('H1234', '2021-01-01', '2025-01-01'),
        buildMemberStop('H5678', '2021-01-01', '2040-01-01'),
      ]),
      validityStart: '2020-01-01',
      validityEnd: '2030-01-01',
      indefinite: false,
    });

    expect(result.current.conflictingMemberStops).toEqual([
      {
        publicCode: 'H5678',
        validityStart: Temporal.PlainDate.from('2021-01-01'),
        validityEnd: Temporal.PlainDate.from('2040-01-01'),
      },
    ]);
  });
});
