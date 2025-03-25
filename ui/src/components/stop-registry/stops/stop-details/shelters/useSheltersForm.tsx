import { useCallback } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { mapShelterDataToFormState, SheltersFormState } from './schema';

type UtilProps = {
  methods: UseFormReturn<SheltersFormState>;
  onShelterCountChanged: (newShelterCount: number) => void;
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
    append(mapShelterDataToFormState({}));
    updateShelterCount();
  }, [append, updateShelterCount]);

  const copyToNewShelter = useCallback(
    (shelterIndex: number) => {
      const currentShelters = getValues('shelters'); // Get the latest state
      const shelterToCopy = currentShelters?.at(shelterIndex);
      const newShelter = shelterToCopy ? { ...shelterToCopy, id: null } : null;

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
