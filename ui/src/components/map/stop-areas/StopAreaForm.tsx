import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Column } from '../../../layoutComponents';
import { mapToISODate } from '../../../time';
import { StopAreaByIdResult } from '../../../types';
import { StopRegistryGeoJsonDefined, mapLngLatToPoint } from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../forms/common';
import {
  NameConsistencyChecker,
  SelectMemberStopsDropdown,
  TypedName,
} from '../../forms/stop-area';
import {
  StopAreaFormState as FormState,
  stopAreaFormSchema,
  stopAreaMemberStopSchema,
} from '../../forms/stop-area/stopAreaFormSchema';

const testIds = {
  form: 'StopAreaFormComponent::form',
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

function getOverriddenNames(
  methods: UseFormReturn<FormState>,
): ReadonlyArray<TypedName> {
  const [name] = methods.watch(['name']);
  return [
    {
      type: 'TRANSLATION',
      lang: 'fin',
      value: name,
    },
    // No short name or translations in this form.
  ];
}

function getMemberStopIds(
  methods: UseFormReturn<FormState>,
): ReadonlyArray<string> {
  const memberStops = methods.watch('memberStops');
  return memberStops.map((it) => it.id);
}

type Props = {
  readonly className?: string;
  readonly defaultValues: Partial<FormState>;
  readonly editedStopAreaId: string | null | undefined;
  readonly onSubmit: (changes: FormState) => void;
};

const StopAreaFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  Props
> = (
  { className = '', defaultValues, editedStopAreaId, onSubmit }: Props,
  ref,
) => {
  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
  const { handleSubmit } = methods;

  const memberStopIds = getMemberStopIds(methods);
  const overriddenNames = getOverriddenNames(methods);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        data-testid={testIds.form}
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
              <NameConsistencyChecker.NameAndMembersForm
                memberStopIds={memberStopIds}
                stopAreaId={editedStopAreaId}
                stopAreaNameOverrides={overriddenNames}
              />
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

export const StopAreaForm = React.forwardRef(StopAreaFormComponent);
