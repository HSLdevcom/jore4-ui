import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import {
  StopRegistryGroupOfStopPlaces,
  StopRegistryGroupOfStopPlacesInput,
} from '../../../generated/graphql';
import { Column } from '../../../layoutComponents';
import { mapToISODate } from '../../../time';
import {
  StopRegistryGeoJsonDefined,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapLngLatToPoint,
  mapPointToStopRegistryGeoJSON,
} from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
  ValidityPeriodFormState,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../../forms/common';

const schema = z
  .object({
    // id: z.string().uuid().optional(), // for stop areas that are edited, TODO
    label: requiredString,
    name: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
  })
  .merge(validityPeriodFormSchema);

const testIds = {
  label: 'StopAreaFormComponent::label',
  name: 'StopAreaFormComponent::name',
  latitude: 'StopAreaFormComponent::latitude',
  longitude: 'StopAreaFormComponent::longitude',
};

export type FormState = z.infer<typeof schema> & ValidityPeriodFormState;

export const mapStopAreaDataToFormState = (
  stopArea: StopRegistryGroupOfStopPlaces & {
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
  onSubmit: (changes: StopRegistryGroupOfStopPlacesInput) => void;
}

const StopFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;

  const mapFormStateToInput = (
    state: FormState,
  ): StopRegistryGroupOfStopPlacesInput => {
    const validityStart = mapDateInputToValidityStart(state.validityStart);
    const input: StopRegistryGroupOfStopPlacesInput = {
      name: {
        value: state.label,
        lang: 'fin',
      },
      description: {
        value: state.name,
        lang: 'fin',
      },
      geometry: mapPointToStopRegistryGeoJSON(state),
      validBetween: validityStart && {
        fromDate: validityStart,
        toDate: mapDateInputToValidityEnd(state.validityEnd, state.indefinite),
      },
    };
    return input;
  };

  const onFormSubmit = (state: FormState) => {
    const changes = mapFormStateToInput(state);
    onSubmit(changes);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onFormSubmit)}
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
