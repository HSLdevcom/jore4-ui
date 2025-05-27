import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../../layoutComponents';
import { FormColumn, InputField, InputLabel } from '../../../../forms/common';
import { LocationDetailsFormState, locationDetailsFormSchema } from './schema';

const testIds = {
  streetAddress: 'LocationDetailsForm::streetAddress',
  postalCode: 'LocationDetailsForm::postalCode',
  municipality: 'LocationDetailsForm::municipality',
  fareZone: 'LocationDetailsForm::fareZone',
  latitude: 'LocationDetailsForm::latitude',
  longitude: 'LocationDetailsForm::longitude',
  altitude: 'LocationDetailsForm::altitude',
  functionalArea: 'LocationDetailsForm::functionalArea',
};

type LocationDetailsFormComponentProps = {
  readonly className?: string;
  readonly defaultValues: Partial<LocationDetailsFormState>;
  readonly municipality?: string | null;
  readonly fareZone?: string | null;
  readonly onSubmit: (state: LocationDetailsFormState) => void;
};

const LocationDetailsFormComponent = (
  {
    className = '',
    defaultValues,
    municipality,
    fareZone,
    onSubmit,
  }: LocationDetailsFormComponentProps,
  ref: ExplicitAny,
): React.ReactElement => {
  const { t } = useTranslation();

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
            <Column>
              <InputLabel
                fieldPath="municipality"
                translationPrefix="stopDetails.location"
              />
              <div
                className="flex h-full items-center"
                title={t('stopDetails.location.municipalityInputNote')}
              >
                <span
                  id="stopDetails.location.municipality"
                  data-testid={testIds.municipality}
                >
                  {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    municipality || '-'
                  }
                </span>
                <i className="icon-info text-lg text-brand" />
              </div>
            </Column>
            <Column>
              <InputLabel
                fieldPath="fareZone"
                translationPrefix="stopDetails.location"
              />
              <div
                className="flex h-full items-center"
                title={t('stopDetails.location.fareZoneInputNote')}
              >
                <span
                  id="stopDetails.location.fareZone"
                  data-testid={testIds.fareZone}
                >
                  {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    fareZone || '-'
                  }
                </span>
                <i className="icon-info text-lg text-brand" />
              </div>
            </Column>
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
