import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { HorizontalSeparator, SlimSimpleButton } from '../layout';
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

interface Props {
  className?: string;
  defaultValues: SheltersFormState;
  onSubmit: (state: SheltersFormState) => void;
  onShelterCountChanged: (newShelterCount: number) => void;
}

const SheltersFormComponent = (
  { className, defaultValues, onSubmit, onShelterCountChanged }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const methods = useForm<SheltersFormState>({
    defaultValues,
    resolver: zodResolver(sheltersFormSchema),
  });
  const { control, setValue, getValues, handleSubmit } = methods;
  const updateShelterCount = () => {
    const shelterCount = getValues('shelters').filter(
      (s) => !s.toBeDeleted,
    ).length;
    onShelterCountChanged(shelterCount);
  };

  const {
    append,
    fields: shelters,
    remove,
  } = useFieldArray({
    control,
    name: 'shelters',
  });
  const addNewShelter = () => {
    append(mapShelterDataToFormState({}));
    updateShelterCount();
  };
  const onRemoveShelter = (idx: number) => {
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
  };
  const isLast = (idx: number) => idx === shelters.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        {shelters.map((shelter, idx) => (
          <div key={shelter.id} data-testid={testIds.shelter}>
            <ShelterFormFields index={idx} onRemove={onRemoveShelter} />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <div className="mt-4">
          <SlimSimpleButton testId={testIds.addShelter} onClick={addNewShelter}>
            {t('stopDetails.shelters.addShelter')}
          </SlimSimpleButton>
        </div>
      </form>
    </FormProvider>
  );
};

export const SheltersForm = React.forwardRef(SheltersFormComponent);
