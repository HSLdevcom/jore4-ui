import { zodResolver } from '@hookform/resolvers/zod';
import React, { useImperativeHandle, useRef } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { SheltersFormState, sheltersFormSchema } from './schema';
import { ShelterFormFields } from './ShelterFormFields';
import { useSheltersFormUtils } from './useSheltersForm';

const testIds = {
  shelter: 'SheltersForm::shelter',
  addShelter: 'SheltersForm::addShelter',
};

type SheltersFormProps = {
  readonly className?: string;
  readonly defaultValues: SheltersFormState;
  readonly formRef: React.RefObject<HTMLFormElement>;
  readonly onSubmit: (state: SheltersFormState) => void;
  readonly onShelterCountChanged: (newShelterCount: number) => void;
};

export type SheltersFormRef = {
  readonly addNewShelter: () => void;
};

const SheltersFormComponent = (
  {
    className = '',
    defaultValues,
    formRef,
    onSubmit,
    onShelterCountChanged,
  }: SheltersFormProps,
  ref: React.Ref<SheltersFormRef>,
): React.ReactElement => {
  const formElementRef = useRef<HTMLFormElement>(null);

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

  useImperativeHandle(ref, () => ({
    addNewShelter,
    submit: () => {
      if (formElementRef.current) {
        formElementRef.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }
    },
  }));

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={`space-y-4 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
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
      </form>
    </FormProvider>
  );
};

export const SheltersForm = React.forwardRef<
  SheltersFormRef,
  SheltersFormProps
>(SheltersFormComponent);
