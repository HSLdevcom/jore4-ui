import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopAreaByIdResult } from '../../../hooks';
import { Column } from '../../../layoutComponents';
import { mapToISODate } from '../../../time';
import { StopRegistryGeoJsonDefined, mapLngLatToPoint } from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../forms/common';
import {
  StopAreaFormState as FormState,
  stopAreaFormSchema,
} from './stopAreaFormSchema';

const testIds = {
  label: 'StopAreaFormComponent::label',
  name: 'StopAreaFormComponent::name',
  latitude: 'StopAreaFormComponent::latitude',
  longitude: 'StopAreaFormComponent::longitude',
};

export const mapStopAreaDataToFormState = (
  stopArea: StopAreaByIdResult & {
    geometry: StopRegistryGeoJsonDefined;
  },
) => {
  const { latitude, longitude } = mapLngLatToPoint(
    stopArea?.geometry?.coordinates,
  );

  const formState: Partial<FormState> = {
    label: stopArea.name?.value ?? undefined,
    name: stopArea.description?.value ?? undefined,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    validityStart: mapToISODate(stopArea.validBetween?.fromDate),
    validityEnd: mapToISODate(stopArea.validBetween?.toDate),
    indefinite: !stopArea.validBetween?.toDate,
  };

  return formState;
};

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (changes: FormState) => void;
}

const StopFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <h3>{t('stopArea.stopArea')}</h3>
        <FormColumn>
          <FormRow mdColumns={2}>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopArea"
                fieldPath="label"
                testId={testIds.label}
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopArea"
                fieldPath="name"
                testId={testIds.name}
              />
            </Column>
          </FormRow>
          <FormRow mdColumns={2}>
            <Column className="space-y-4">
              <FormRow mdColumns={2}>
                <InputField<FormState>
                  type="number"
                  translationPrefix="map"
                  fieldPath="latitude"
                  testId={testIds.latitude}
                  step="any"
                />
                <InputField<FormState>
                  type="number"
                  translationPrefix="map"
                  fieldPath="longitude"
                  testId={testIds.longitude}
                  step="any"
                />
              </FormRow>
            </Column>
          </FormRow>
          <FormRow>
            <ValidityPeriodForm />
          </FormRow>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const StopAreaForm = React.forwardRef(StopFormComponent);
