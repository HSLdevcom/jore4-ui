import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import { useLoader } from '../../../../../hooks';
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
  StopAreaFormState,
  stopAreaFormSchema,
  stopAreaMemberStopSchema,
  useUpsertStopArea,
} from '../../../../forms/stop-area';

const testIds = {
  label: 'StopAreaDetailsEdit::label',
  name: 'StopAreaDetailsEdit::name',
  latitude: 'StopAreaDetailsEdit::latitude',
  longitude: 'StopAreaDetailsEdit::longitude',
};

export const mapStopAreaDataToFormState = (
  area: StopAreaDetailsFragment,
): Partial<FormState> => {
  const { latitude, longitude } = mapLngLatToPoint(
    area.geometry?.coordinates ?? [],
  );

  const mappedMembers = area.members
    ?.map((rawMember) => stopAreaMemberStopSchema.safeParse(rawMember))
    .filter((parseResult) => parseResult.success)
    .map((parseResult) => parseResult.data);

  return {
    label: area.name?.value ?? undefined,
    name: area.description?.value ?? undefined,
    latitude,
    longitude,
    memberStops: mappedMembers ?? [],
    validityStart: mapToISODate(area.validBetween?.fromDate),
    validityEnd: mapToISODate(area.validBetween?.toDate),
    indefinite: !area.validBetween?.toDate,
  };
};

type StopAreaDetailsEditProps = {
  readonly area: StopAreaDetailsFragment;
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
      await upsertStopArea({ id: area.id, state });
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
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const StopAreaDetailsEdit = forwardRef(StopAreaDetailsEditImpl);
