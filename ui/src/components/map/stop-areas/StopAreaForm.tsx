import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { EnrichedStopPlace } from '../../../hooks';
import { Column } from '../../../layoutComponents';
import { mapToISODate } from '../../../time';
import { mapLngLatToPoint } from '../../../utils';
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
  privateCode: 'StopAreaFormComponent::privateCode',
  name: 'StopAreaFormComponent::name',
  latitude: 'StopAreaFormComponent::latitude',
  longitude: 'StopAreaFormComponent::longitude',
  quays: 'StopAreaFormComponent::quays',
};

export const mapStopAreaDataToFormState = (stopArea: EnrichedStopPlace) => {
  const { latitude, longitude } = mapLngLatToPoint(
    stopArea?.geometry?.coordinates ?? [],
  );

  const quays = stopArea.quays
    ?.map((quay) =>
      stopAreaMemberStopSchema.safeParse({
        ...quay,
        name: {
          value: stopArea.name,
          lang: 'fin',
        },
      }),
    )
    .filter((parseResult) => parseResult.success)
    .map((parseResult) => parseResult.data);

  const formState: Partial<FormState> = {
    privateCode: stopArea.privateCode?.value ?? undefined,
    name: stopArea.name,
    nameSwe: stopArea.nameSwe ?? stopArea.name,
    nameLongFin: stopArea.nameLongFin,
    nameLongSwe: stopArea.nameLongSwe,
    abbreviationFin: stopArea.abbreviationFin,
    abbreviationSwe: stopArea.abbreviationSwe,
    abbreviation5CharFin: stopArea.abbreviation5CharFin,
    abbreviation5CharSwe: stopArea.abbreviation5CharSwe,
    latitude,
    longitude,
    quays: quays ?? [],
    validityStart: mapToISODate(stopArea.validityStart),
    validityEnd: mapToISODate(stopArea.validityEnd),
    indefinite: !stopArea.validityEnd,
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
  const quays = methods.watch('quays');
  return quays.map((it) => it.id);
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
        onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
        ref={ref}
      >
        <h3>{t('stopArea.stopArea')}</h3>
        <FormColumn>
          <FormRow mdColumns={2}>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopArea"
                fieldPath="privateCode"
                testId={testIds.privateCode}
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
                fieldPath="quays"
                translationPrefix="stopArea"
                testId={testIds.quays}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={({ value, onChange }) => (
                  <SelectMemberStopsDropdown
                    disabled
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
