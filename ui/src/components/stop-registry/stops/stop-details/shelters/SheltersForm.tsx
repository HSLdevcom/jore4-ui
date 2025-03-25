import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { SlimSimpleButton } from '../layout';
import { SheltersFormState, sheltersFormSchema } from './schema';
import { ShelterFormFields } from './ShelterFormFields';
import { useSheltersFormUtils } from './useSheltersForm';

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
