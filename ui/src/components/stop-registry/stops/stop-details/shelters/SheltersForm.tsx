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
  deleteShelter: 'SheltersForm::deleteShelter',
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
): React.ReactElement => {
  const { t } = useTranslation();
  const methods = useForm<SheltersFormState>({
    defaultValues,
    resolver: zodResolver(sheltersFormSchema),
  });
  const { control, handleSubmit } = methods;

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
    onShelterCountChanged(shelters.length + 1);
  };
  const onRemoveShelter = (idx: number) => {
    // TODO: confirmation. Either here or with some more complex mechanism, check with design.
    remove(idx);
    onShelterCountChanged(shelters.length - 1);
  };
  const isLast = (idx: number) => idx === shelters.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        {shelters.map((shelter, idx) => (
          <div key={shelter.id} data-testid={testIds.shelter}>
            <ShelterFormFields index={idx} />
            <div className="mb-8 mt-6 flex gap-4">
              <SlimSimpleButton
                testId={testIds.deleteShelter}
                onClick={() => onRemoveShelter(idx)}
                inverted
              >
                {t('stopDetails.shelters.deleteShelter')}
              </SlimSimpleButton>
              <Visible visible={isLast(idx)}>
                <SlimSimpleButton
                  testId={testIds.addShelter}
                  onClick={addNewShelter}
                >
                  {t('stopDetails.shelters.addShelter')}
                </SlimSimpleButton>
              </Visible>
            </div>
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <Visible visible={!shelters.length}>
          <SlimSimpleButton testId={testIds.addShelter} onClick={addNewShelter}>
            {t('stopDetails.shelters.addShelter')}
          </SlimSimpleButton>
        </Visible>
      </form>
    </FormProvider>
  );
};

export const SheltersForm = React.forwardRef(SheltersFormComponent);
