import { renderHook } from '@testing-library/react';
import { StopModalStopAreaFormSchema } from '../../../../StopRegistry/Stops/Common/StopForm';
import { useStopAreaValidityConflict } from './useStopAreaValidityConflict';

// Stop area is valid 2020-01-01 - 2030-01-01.
const stopArea: StopModalStopAreaFormSchema = {
  netexId: 'area1',
  privateCode: '1',
  validityStart: '2020-01-01',
  validityEnd: '2030-01-01',
  nameFin: null,
  nameSwe: null,
  nameEng: null,
  longNameFin: null,
  longNameSwe: null,
  longNameEng: null,
  abbreviationFin: null,
  abbreviationSwe: null,
  abbreviationEng: null,
};

// Stop area is valid indefinitely from 2020-01-01 onwards.
const unboundedEndStopArea: StopModalStopAreaFormSchema = {
  ...stopArea,
  netexId: 'area2',
  validityEnd: null,
};

function renderConflictHook(
  params: Parameters<typeof useStopAreaValidityConflict>[0],
) {
  return renderHook(() => useStopAreaValidityConflict(params));
}

describe('useStopAreaValidityConflict', () => {
  test('should not report a conflict when the end date is cleared and indefinite is false', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2021-01-01',
      validityEnd: '',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when indefinite is unchecked while the end date is empty', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2021-01-01',
      validityEnd: undefined,
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when no stop area is selected', () => {
    const { result } = renderConflictHook({
      stopArea: null,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should report a conflict when the stop ends after the stop area', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2021-01-01',
      validityEnd: '2040-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should report a conflict when the stop is indefinite but the stop area is not', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2021-01-01',
      validityEnd: '',
      indefinite: true,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should report a conflict when the stop starts before the stop area', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2019-01-01',
      validityEnd: '2025-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(true);
  });

  test('should not report a conflict when the stop is inside the stop area validity', () => {
    const { result } = renderConflictHook({
      stopArea,
      validityStart: '2021-01-01',
      validityEnd: '2025-01-01',
      indefinite: false,
    });

    expect(result.current.hasConflict).toBe(false);
  });

  test('should not report a conflict when the stop is open-ended inside a stop area with an unbounded end', () => {
    const { result } = renderConflictHook({
      stopArea: unboundedEndStopArea,
      validityStart: '2021-01-01',
      validityEnd: '',
      indefinite: true,
    });

    expect(result.current.hasConflict).toBe(false);
  });
});
