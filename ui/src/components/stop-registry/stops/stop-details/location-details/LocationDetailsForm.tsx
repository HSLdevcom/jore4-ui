import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Row } from '../../../../../layoutComponents';
import { FormColumn, InputField } from '../../../../forms/common';
import { LocationDetailsFormState, locationDetailsFormSchema } from './schema';

const testIds = {
  streetAddress: 'LocationDetailsForm::streetAddress',
  postalCode: 'LocationDetailsForm::postalCode',
  latitude: 'LocationDetailsForm::latitude',
  longitude: 'LocationDetailsForm::longitude',
  altitude: 'LocationDetailsForm::altitude',
  functionalArea: 'LocationDetailsForm::functionalArea',
};

interface Props {
  className?: string;
  defaultValues: Partial<LocationDetailsFormState>;
  onSubmit: (state: LocationDetailsFormState) => void;
}

const LocationDetailsFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const methods = useForm<LocationDetailsFormState>({
    defaultValues,
    resolver: zodResolver(locationDetailsFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <FormColumn>
          <Row className="flex-wrap gap-4">
            <InputField<LocationDetailsFormState>
              type="text"
              translationPrefix="stopDetails.location"
              fieldPath="streetAddress"
              testId={testIds.streetAddress}
            />
            <InputField<LocationDetailsFormState>
              type="text"
              inputClassName="w-24"
              translationPrefix="stopDetails.location"
              fieldPath="postalCode"
              testId={testIds.postalCode}
            />
          </Row>
          <Row className="flex-wrap gap-4">
            <InputField<LocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="stopDetails.location"
              disabled
              size={3}
              fieldPath="latitude"
              testId={testIds.latitude}
            />
            <InputField<LocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="stopDetails.location"
              disabled
              fieldPath="longitude"
              testId={testIds.longitude}
            />
            <InputField<LocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="stopDetails.location"
              disabled
              fieldPath="altitude"
              testId={testIds.altitude}
            />
            <InputField<LocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="stopDetails.location.input"
              min={0}
              fieldPath="functionalArea"
              testId={testIds.functionalArea}
            />
          </Row>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const LocationDetailsForm = React.forwardRef(
  LocationDetailsFormComponent,
);
