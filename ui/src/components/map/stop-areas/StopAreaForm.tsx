import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { mapToISODate } from '../../../time';
import { EnrichedStopPlace } from '../../../types';
import { mapLngLatToPoint } from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../forms/common';
import {
  StopAreaFormState as FormState,
  stopAreaFormSchema,
  stopAreaMemberStopSchema,
} from '../../forms/stop-area/stopAreaFormSchema';
import { StopAreaNames } from './StopAreaNames';

const testIds = {
  form: 'StopAreaFormComponent::form',
  showHideButton: 'StopAreaFormComponent::showHideButton',
  privateCode: 'StopAreaFormComponent::privateCode',
  name: 'StopAreaFormComponent::name',
  nameSwe: 'StopAreaFormComponent::nameSwe',
  nameLongFin: 'StopAreaFormComponent::nameLongFin',
  nameLongSwe: 'StopAreaFormComponent::nameLongSwe',
  abbreviationFin: 'StopAreaFormComponent::abbreviationFin',
  abbreviationSwe: 'StopAreaFormComponent::abbreviationSwe',
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
    latitude,
    longitude,
    quays: quays ?? [],
    validityStart: mapToISODate(stopArea.validityStart),
    validityEnd: mapToISODate(stopArea.validityEnd),
    indefinite: !stopArea.validityEnd,
  };

  return formState;
};

type Props = {
  readonly className?: string;
  readonly defaultValues: Partial<FormState>;
  readonly editedStopAreaId: string | null | undefined;
  readonly onSubmit: (changes: FormState) => void;
};

const StopAreaFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  Props
> = ({ className = '', defaultValues, onSubmit }: Props, ref) => {
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        data-testid={testIds.form}
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <FormColumn className={twMerge('bg-background p-4', className)}>
          <div className="flex gap-4">
            <InputField<FormState>
              type="text"
              translationPrefix="stopArea"
              fieldPath="privateCode"
              testId={testIds.privateCode}
              className="w-2/5"
            />
            <InputField<FormState>
              type="text"
              translationPrefix="stopArea"
              fieldPath="name"
              testId={testIds.name}
              className="w-full"
            />
          </div>

          <FormRow>
            <StopAreaNames />
          </FormRow>
        </FormColumn>
        <FormColumn>
          <FormRow
            mdColumns={2}
            className="px-4 sm:gap-x-4 md:gap-x-4 lg:gap-x-4"
          >
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
          <FormRow className="border-t border-light-grey p-4">
            <ValidityPeriodForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
          </FormRow>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const StopAreaForm = React.forwardRef(StopAreaFormComponent);
