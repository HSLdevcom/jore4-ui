import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { mapToISODate } from '../../../time';
import { EnrichedStopPlace } from '../../../types';
import { mapLngLatToPoint } from '../../../utils';
import {
  FormActionButtons,
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../forms/common';
import { useDirtyFormBlockNavigation } from '../../forms/common/NavigationBlocker';
import {
  StopAreaFormState,
  stopAreaFormSchema,
} from '../../forms/stop-area/stopAreaFormSchema';
import { StopAreaNames } from './StopAreaNames';

const testIds = {
  form: 'StopAreaFormComponent::form',
  showHideButton: 'StopAreaFormComponent::showHideButton',
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

  const formState: StopAreaFormState = {
    privateCode: stopArea.privateCode?.value ?? '',
    name: stopArea.name ?? '',
    nameSwe: stopArea.nameSwe ?? stopArea.name ?? '',
    nameEng: stopArea.nameEng,
    nameLongFin: stopArea.nameLongFin,
    nameLongSwe: stopArea.nameLongSwe,
    nameLongEng: stopArea.nameLongEng,
    abbreviationFin: stopArea.abbreviationFin,
    abbreviationSwe: stopArea.abbreviationSwe,
    abbreviationEng: stopArea.abbreviationEng,
    latitude,
    longitude,
    validityStart: mapToISODate(stopArea.validityStart) ?? '',
    validityEnd: mapToISODate(stopArea.validityEnd),
    indefinite: !stopArea.validityEnd,
  };

  return formState;
};

type StopAreaFormProps = {
  readonly className?: string;
  readonly defaultValues:
    | StopAreaFormState
    | (() => Promise<StopAreaFormState>);
  readonly onCancel: () => void;
  readonly onSubmit: (changes: StopAreaFormState) => void;
  readonly testIdPrefix: string;
};

const StopAreaFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  StopAreaFormProps
> = ({ className, defaultValues, onCancel, onSubmit, testIdPrefix }, ref) => {
  const methods = useForm<StopAreaFormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'StopAreaForm', {
    allowSearchChange: true, // Allow search change so that moving the map does not show the navigation blocked dialog
    allowStateChange: true, // Allow state change so that location state updates do not show the navigation blocked dialog
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        ref={ref}
        data-testid={testIds.form}
        className={twMerge('flex min-h-0 flex-1 flex-col', className)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-6 overflow-auto">
          <FormColumn className="bg-background p-4">
            <div className="flex gap-4">
              <InputField<StopAreaFormState>
                type="text"
                translationPrefix="stopArea"
                fieldPath="privateCode"
                testId={testIds.privateCode}
                className="w-2/5"
                disabled
              />
              <InputField<StopAreaFormState>
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
              <InputField<StopAreaFormState>
                type="number"
                translationPrefix="map"
                fieldPath="latitude"
                testId={testIds.latitude}
                step="any"
              />
              <InputField<StopAreaFormState>
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
        </div>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
          className="mx-0 my-0 border border-light-grey bg-background"
        />
      </form>
    </FormProvider>
  );
};

export const StopAreaForm = forwardRef(StopAreaFormComponent);
