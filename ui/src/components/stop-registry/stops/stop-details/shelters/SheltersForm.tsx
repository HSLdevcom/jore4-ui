import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Visible } from '../../../../../layoutComponents';
import { HorizontalSeparator } from '../layout';
import { SheltersFormState, sheltersFormSchema } from './schema';
import { ShelterFormRow } from './ShelterFormRow';

interface Props {
  className?: string;
  defaultValues: SheltersFormState;
  onSubmit: (state: SheltersFormState) => void;
}

const SheltersFormComponent = (
  { className, defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const methods = useForm<SheltersFormState>({
    defaultValues,
    resolver: zodResolver(sheltersFormSchema),
  });
  const { control, handleSubmit } = methods;

  const { fields: shelters } = useFieldArray({
    control,
    name: 'shelters',
  });
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        {shelters.map((shelterRow, idx) => (
          <div key={shelterRow.id}>
            <ShelterFormRow index={idx} />
            <Visible visible={idx !== shelters.length - 1}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
      </form>
    </FormProvider>
  );
};

export const SheltersForm = React.forwardRef(SheltersFormComponent);
