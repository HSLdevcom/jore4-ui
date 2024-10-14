import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import {
  HorizontalSeparator,
  Visible,
} from '../../../../../../layoutComponents';
import { InfoSpotFormFields } from './InfoSpotsFormFields';
import { InfoSpotsFormSchema, InfoSpotsFormState } from './schema';

const testIds = {
  infoSpot: 'InfoSpotsForm::infoSpot',
};

type Props = {
  readonly className?: string;
  readonly defaultValues: InfoSpotsFormState;
  readonly onSubmit: (state: InfoSpotsFormState) => void;
};

const InfoSpotsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  Props
> = ({ className, defaultValues, onSubmit }, ref) => {
  const methods = useForm<InfoSpotsFormState>({
    defaultValues,
    resolver: zodResolver(InfoSpotsFormSchema),
  });
  const { control, handleSubmit } = methods;

  const { fields: infoSpots } = useFieldArray({
    control,
    name: 'infoSpots',
  });

  const isLast = (idx: number) => idx === infoSpots.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-4', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {infoSpots.map((infoSpot, idx) => (
          <div key={infoSpot.id} data-testid={testIds.infoSpot}>
            <InfoSpotFormFields index={idx} />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
      </form>
    </FormProvider>
  );
};

export const InfoSpotsForm = React.forwardRef(InfoSpotsFormComponent);
