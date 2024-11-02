import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import {
  FormProvider,
  UseFormReturn,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { SlimSimpleButton } from '../layout';
import {
  SheltersFormState,
  mapShelterDataToFormState,
  sheltersFormSchema,
} from './schema';
import { ShelterFormFields } from './ShelterFormFields';

const testIds = {
  shelter: 'SheltersForm::shelter',
  addShelter: 'SheltersForm::addShelter',
};

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
      updateShelterCount();
      const currentShelters = getValues('shelters'); // Get the latest state
      const newShelter = {
        ...currentShelters?.at(shelterIndex),
        id: null,
      } as ShelterEquipmentDetailsFragment;

      if (newShelter) {
        append(mapShelterDataToFormState(newShelter));
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

interface Props {
  className?: string;
  defaultValues: SheltersFormState;
  onSubmit: (state: SheltersFormState) => void;
  onShelterCountChanged: (newShelterCount: number) => void;
}

const SheltersFormComponent = (
  { className = '', defaultValues, onSubmit, onShelterCountChanged }: Props,
  ref: ExplicitAny,
): React.ReactElement => {
  const { t } = useTranslation();

  const methods: UseFormReturn<SheltersFormState> = useForm<SheltersFormState>({
    defaultValues,
    resolver: zodResolver(sheltersFormSchema),
  });

  const {
    shelters,
    addNewShelter,
    copyToNewShelter,
    onRemoveShelter,
    isLast,
    handleSubmit,
  } = useSheltersFormUtils({ methods, onShelterCountChanged });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={`space-y-4 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {shelters.map((shelter, idx) => (
          <div key={shelter.id} data-testid={testIds.shelter}>
            <ShelterFormFields
              index={idx}
              onRemove={onRemoveShelter}
              onCopy={copyToNewShelter}
            />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <SlimSimpleButton
          testId={testIds.addShelter}
          onClick={addNewShelter}
          className="flex-shrink-0"
        >
          {t('stopDetails.shelters.addShelter')}
        </SlimSimpleButton>
      </form>
    </FormProvider>
  );
};

export const SheltersForm = React.forwardRef(SheltersFormComponent);
