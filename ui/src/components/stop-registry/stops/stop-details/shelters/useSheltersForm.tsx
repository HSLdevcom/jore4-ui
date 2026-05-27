import { useCallback } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { SheltersFormState, mapShelterDataToFormState } from './schema';

type UtilProps = {
  readonly methods: UseFormReturn<SheltersFormState>;
  readonly onShelterCountChanged: (newShelterCount: number) => void;
};

const getNextShelterNumber = (
  shelters: SheltersFormState['shelters'],
): number => {
  const usedNumbers = shelters
    .map((shelter) => shelter.shelterNumber)
    .filter((num): num is number => num !== null && !Number.isNaN(num));

  return (usedNumbers.length ? Math.max(...usedNumbers) : 0) + 1;
};

export const useSheltersFormUtils = (props: UtilProps) => {
  const { methods, onShelterCountChanged } = props;
  const { control, setValue, getValues, handleSubmit } = methods;

  const {
    append,
    fields: shelters,
    remove,
  } = useFieldArray({
    control,
    name: 'shelters',
  });

  const updateShelterCount = useCallback(() => {
    const shelterCount = getValues('shelters').filter(
      (s) => !s.toBeDeleted,
    ).length;
    onShelterCountChanged(shelterCount);
  }, [getValues, onShelterCountChanged]);

  const addNewShelter = useCallback(() => {
    const currentShelters = getValues('shelters');
    const nextShelterNumber = getNextShelterNumber(currentShelters);

    append({
      ...mapShelterDataToFormState({}),
      shelterNumber: nextShelterNumber,
    });
    updateShelterCount();
  }, [append, getValues, updateShelterCount]);

  const copyToNewShelter = useCallback(
    (shelterIndex: number) => {
      const currentShelters = getValues('shelters'); // Get the latest state
      const shelterToCopy = currentShelters?.at(shelterIndex);
      const newShelter = shelterToCopy
        ? {
            ...shelterToCopy,
            id: null,
            shelterNumber: getNextShelterNumber(currentShelters),
          }
        : null;

      if (newShelter) {
        append(
          mapShelterDataToFormState(
            newShelter as ShelterEquipmentDetailsFragment,
          ),
        );
        updateShelterCount();
      }
    },
    [append, getValues, updateShelterCount],
  );

  const onRemoveShelter = useCallback(
    (idx: number) => {
      const shelter = shelters[idx];
      // A newly added, non persisted shelter is deleted immediately.
      // A persisted one is only marked as to be deleted later when saving.
      if (!shelter.shelterId) {
        remove(idx);
      } else {
        const newToBeDeleted = !getValues(`shelters.${idx}.toBeDeleted`);
        setValue(`shelters.${idx}.toBeDeleted`, newToBeDeleted, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      updateShelterCount();
    },
    [getValues, remove, setValue, shelters, updateShelterCount],
  );

  const isLast = (idx: number) => idx === shelters.length - 1;

  return {
    shelters,
    addNewShelter,
    copyToNewShelter,
    onRemoveShelter,
    isLast,
    handleSubmit,
  };
};
