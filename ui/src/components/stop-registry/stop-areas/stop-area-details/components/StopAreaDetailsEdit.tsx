import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopPlaceWithDetails, useLoader } from '../../../../../hooks';
import { Column } from '../../../../../layoutComponents';
import { Operation } from '../../../../../redux';
import { mapToISODate } from '../../../../../time';
import { mapLngLatToPoint, showSuccessToast } from '../../../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../../../forms/common';
import {
  StopAreaFormState as FormState,
  NameConsistencyChecker,
  StopAreaFormState,
  TypedName,
  stopAreaFormSchema,
  useUpsertStopArea,
} from '../../../../forms/stop-area';

const testIds = {
  label: 'StopAreaDetailsEdit::label',
  name: 'StopAreaDetailsEdit::name',
  latitude: 'StopAreaDetailsEdit::latitude',
  longitude: 'StopAreaDetailsEdit::longitude',
};

export const mapStopAreaDataToFormState = (
  area: StopPlaceWithDetails,
): Partial<FormState> => {
  const { latitude, longitude } = mapLngLatToPoint(
    area.stop_place?.geometry?.coordinates ?? [],
  );

  return {
    label: area.stop_place?.name?.value ?? undefined,
    name: area.stop_place?.name ?? undefined,
    latitude,
    longitude,
    validityStart: mapToISODate(area.stop_place?.validityStart),
    validityEnd: mapToISODate(area.stop_place?.validityEnd),
    indefinite: !area.stop_place?.validityEnd,
  };
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
    // TODO: Short name + translations
  ];
}

type StopAreaDetailsEditProps = {
  readonly area: StopPlaceWithDetails;
  readonly className?: string;
  readonly refetch: () => Promise<unknown>;
  readonly onFinishEditing: () => void;
};

const StopAreaDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  StopAreaDetailsEditProps
> = ({ area, className = '', onFinishEditing, refetch }, ref) => {
  const { t } = useTranslation();

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const { setIsLoading } = useLoader(Operation.ModifyStopArea);
  const onSubmit = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      await upsertStopArea({ id: area.stop_place?.id, state });
      await refetch();

      showSuccessToast(t('stopArea.editSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const defaultValues = useMemo(() => mapStopAreaDataToFormState(area), [area]);
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
  const { handleSubmit } = methods;

  const overriddenNames = getOverriddenNames(methods);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <FormColumn>
          <FormRow lgColumns={4} mdColumns={2}>
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
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="latitude"
                testId={testIds.latitude}
                step="any"
                disabled
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="longitude"
                testId={testIds.longitude}
                step="any"
                disabled
              />
            </Column>
          </FormRow>
          <FormRow lgColumns={2} mdColumns={1}>
            <ValidityPeriodForm />
          </FormRow>

          <NameConsistencyChecker.NameOnlyForm
            stopAreaId={area.stop_place?.id as string}
            stopAreaNameOverrides={overriddenNames}
          />
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const StopAreaDetailsEdit = forwardRef(StopAreaDetailsEditImpl);
