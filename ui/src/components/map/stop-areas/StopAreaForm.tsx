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
import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';
import {
  StopAreaFormState as FormState,
  stopAreaFormSchema,
  stopAreaMemberStopSchema,
} from './stopAreaFormSchema';

const testIds = {
  label: 'StopAreaFormComponent::label',
  name: 'StopAreaFormComponent::name',
  latitude: 'StopAreaFormComponent::latitude',
  longitude: 'StopAreaFormComponent::longitude',
  memberStops: 'StopAreaFormComponent::memberStops',
};

export const mapStopAreaDataToFormState = (
  stopArea: StopAreaByIdResult & {
    geometry: StopRegistryGeoJsonDefined;
  },
) => {
  const { latitude, longitude } = mapLngLatToPoint(
    stopArea?.geometry?.coordinates,
  );

  const mappedMembers = stopArea.members
    ?.map((rawMember) => stopAreaMemberStopSchema.safeParse(rawMember))
    .filter((parseResult) => parseResult.success)
    .map((parseResult) => parseResult.data);

  const formState: Partial<FormState> = {
    label: stopArea.name?.value ?? undefined,
    name: stopArea.description?.value ?? undefined,
    latitude,
    longitude,
    memberStops: mappedMembers ?? [],
    validityStart: mapToISODate(stopArea.validBetween?.fromDate),
    validityEnd: mapToISODate(stopArea.validBetween?.toDate),
    indefinite: !stopArea.validBetween?.toDate,
  };

  return formState;
};

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  editedStopAreaId: string | null | undefined;
  onSubmit: (changes: FormState) => void;
}

const StopFormComponent = (
  { className = '', defaultValues, editedStopAreaId, onSubmit }: Props,
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
          <FormRow mdColumns={4}>
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="latitude"
                testId={testIds.latitude}
                step="any"
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="longitude"
                testId={testIds.longitude}
                step="any"
              />
            </Column>
            <Column className="col-span-2">
              <InputField<FormState>
                fieldPath="memberStops"
                translationPrefix="stopArea"
                testId={testIds.memberStops}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={({ value, onChange }) => (
                  <SelectMemberStopsDropdown
                    editedStopAreaId={editedStopAreaId}
                    // The form related component typings have been effed up.
                    // Everything is typed as a string.
                    // Cast to Any until the form-typings get fixed (huge rewrite)
                    value={value as ExplicitAny}
                    onChange={onChange}
                  />
                )}
              />
            </Column>
          </FormRow>
          <FormRow mdColumns={2}>
            <Column className="col-start-2">
              <p className="text-hsl-red">{t('stopArea.sharedNameNotice')}</p>
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
