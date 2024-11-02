import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  ShelterEquipmentDetailsFragment,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import { mapShelterDataToFormState } from './schema';
import { useSheltersFormUtils } from './SheltersForm';

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useForm: jest.fn(),
    useFieldArray: jest.fn(),
  };
});

const testShelter: ShelterEquipmentDetailsFragment = {
  id: 'testId',
  enclosed: false,
  stepFree: false,
  shelterType: StopRegistryShelterType.Concrete,
  shelterElectricity: StopRegistryShelterElectricity.Continuous,
  shelterLighting: false,
  shelterCondition: StopRegistryShelterCondition.Mediocre,
  timetableCabinets: 1,
  trashCan: false,
  shelterHasDisplay: false,
  bicycleParking: false,
  leaningRail: false,
  outsideBench: false,
  shelterFasciaBoardTaping: false,
};
const testShelters = [testShelter];

describe('useSheltersFormUtils', () => {
  const mockOnShelterCountChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useForm as jest.Mock).mockReturnValue({
      control: {},
      setValue: jest.fn(),
      getValues: jest.fn(() => testShelters),
      handleSubmit: jest.fn(),
    });

    (useFieldArray as jest.Mock).mockReturnValue({
      append: jest.fn(),
      remove: jest.fn(),
      fields: testShelters,
    });
  });

  test('should add a new shelter and update shelter count', () => {
    const appendMock = jest.fn();
    (useFieldArray as jest.Mock).mockReturnValue({
      append: appendMock,
      fields: [],
    });

    const { result } = renderHook(() =>
      useSheltersFormUtils({
        methods: useForm(),
        onShelterCountChanged: mockOnShelterCountChanged,
      }),
    );

    act(() => {
      result.current.addNewShelter();
    });

    expect(appendMock).toHaveBeenCalledWith(mapShelterDataToFormState({}));
    expect(mockOnShelterCountChanged).toHaveBeenCalledWith(1);
  });

  test('should copy to new shelter and update shelter count', () => {
    const appendMock = jest.fn();
    (useFieldArray as jest.Mock).mockReturnValue({
      append: appendMock,
      fields: [...testShelters],
    });

    const { result } = renderHook(() =>
      useSheltersFormUtils({
        methods: useForm(),
        onShelterCountChanged: mockOnShelterCountChanged,
      }),
    );

    act(() => {
      result.current.copyToNewShelter(0);
    });

    expect(appendMock).toHaveBeenCalledWith(
      expect.objectContaining(
        mapShelterDataToFormState({
          ...testShelter,
          id: null,
        }),
      ),
    );
    expect(mockOnShelterCountChanged).toHaveBeenCalledWith(1);
  });

  test('should mark a persisted shelter for deletion instead of removing it', () => {
    const setValueMock = jest.fn();
    const getValuesMock = jest
      .fn()
      .mockReturnValue([{ shelterId: 1, toBeDeleted: false }]);

    (useForm as jest.Mock).mockReturnValue({
      control: {},
      setValue: setValueMock,
      getValues: getValuesMock,
      handleSubmit: jest.fn(),
    });

    (useFieldArray as jest.Mock).mockReturnValue({
      append: jest.fn(),
      remove: jest.fn(),
      fields: [{ shelterId: 1, toBeDeleted: false }],
    });

    const { result } = renderHook(() =>
      useSheltersFormUtils({
        methods: useForm(),
        onShelterCountChanged: mockOnShelterCountChanged,
      }),
    );

    act(() => {
      result.current.onRemoveShelter(0);
    });

    expect(setValueMock).toHaveBeenCalledWith('shelters.0.toBeDeleted', false, {
      shouldDirty: true,
      shouldTouch: true,
    });
    expect(mockOnShelterCountChanged).toHaveBeenCalledWith(1);
  });

  test('should immediately remove a non-persisted shelter', () => {
    const removeMock = jest.fn();
    const getValuesMock = jest.fn().mockReturnValue([{ shelterId: null }]);

    (useForm as jest.Mock).mockReturnValue({
      control: {},
      setValue: jest.fn(),
      getValues: getValuesMock,
      handleSubmit: jest.fn(),
    });

    (useFieldArray as jest.Mock).mockReturnValue({
      append: jest.fn(),
      remove: removeMock,
      fields: [{ shelterId: null }],
    });

    const { result } = renderHook(() =>
      useSheltersFormUtils({
        methods: useForm(),
        onShelterCountChanged: mockOnShelterCountChanged,
      }),
    );

    act(() => {
      result.current.onRemoveShelter(0);
    });

    expect(removeMock).toHaveBeenCalledWith(0);
    expect(mockOnShelterCountChanged).toHaveBeenCalledWith(1);
  });

  test('should return true for isLast if index is the last shelter', () => {
    (useFieldArray as jest.Mock).mockReturnValue({
      append: jest.fn(),
      remove: jest.fn(),
      fields: [{ shelterId: 1 }, { shelterId: 2 }],
    });

    const { result } = renderHook(() =>
      useSheltersFormUtils({
        methods: useForm(),
        onShelterCountChanged: mockOnShelterCountChanged,
      }),
    );

    expect(result.current.isLast(1)).toBe(true);
    expect(result.current.isLast(0)).toBe(false);
  });
});
