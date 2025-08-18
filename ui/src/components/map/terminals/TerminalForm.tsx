import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../forms/common';
import { useDirtyFormBlockNavigation } from '../../forms/common/NavigationBlocker';
import { TerminalTypeDropdown } from '../../stop-registry/components/TerminalTypeDropdown';
import {
  TerminalFormState,
  terminalFormSchema,
} from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { SelectTerminalMemberStopsDropdown } from '../../stop-registry/terminals/components/location-details/member-stops';
import { TerminalNames } from './TerminalNames';

const testIds = {
  form: 'TerminalFormComponent::form',
  showHideButton: 'TerminalFormComponent::showHideButton',
  privateCode: 'TerminalFormComponent::privateCode',
  name: 'TerminalFormComponent::name',
  latitude: 'TerminalFormComponent::latitude',
  longitude: 'TerminalFormComponent::longitude',
  terminalType: 'TerminalFormComponent::terminalType',
  memberStops: 'TerminalLocationDetailsEdit::memberStops',
};

type TerminalFormProps = {
  readonly className?: string;
  readonly defaultValues:
    | TerminalFormState
    | (() => Promise<TerminalFormState>);
  readonly onSubmit: (changes: TerminalFormState) => void;
};

const TerminalFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalFormProps
> = ({ className = '', defaultValues, onSubmit }, ref) => {
  const { t } = useTranslation();

  const methods = useForm<TerminalFormState>({
    defaultValues,
    resolver: zodResolver(terminalFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'TerminalForm', {
    allowSearchChange: true, // Allow search change so that moving the map does not show the navigation blocked dialog
  });
  const { handleSubmit } = methods;

  const {
    field: { value: selectedStops, onChange: onSelectedStopsChange },
  } = useController({
    name: 'selectedStops',
    control: methods.control,
    defaultValue: [],
  });

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
            <InputField<TerminalFormState>
              type="text"
              translationPrefix="terminal"
              fieldPath="privateCode"
              testId={testIds.privateCode}
              className="w-2/5"
              disabled
            />
            <InputField<TerminalFormState>
              type="text"
              translationPrefix="terminal"
              fieldPath="name"
              testId={testIds.name}
              className="w-full"
            />
          </div>

          <FormRow>
            <TerminalNames />
          </FormRow>
        </FormColumn>
        <FormColumn>
          <FormRow
            mdColumns={4}
            className="px-4 sm:gap-x-4 md:gap-x-4 lg:gap-x-4"
          >
            <InputField<TerminalFormState>
              type="number"
              translationPrefix="map"
              fieldPath="latitude"
              testId={testIds.latitude}
              step="any"
            />
            <InputField<TerminalFormState>
              type="number"
              translationPrefix="map"
              fieldPath="longitude"
              testId={testIds.longitude}
              step="any"
            />

            <InputField<TerminalFormState>
              translationPrefix="terminalDetails.basicDetails"
              fieldPath="terminalType"
              testId={testIds.terminalType}
              className="md:col-span-2"
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <TerminalTypeDropdown
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
          </FormRow>
          <FormRow
            mdColumns={1}
            className="px-4 sm:gap-x-4 md:gap-x-4 lg:gap-x-4"
          >
            <div>
              <div className="mb-2 text-sm font-bold">
                {t('terminalDetails.location.memberStopsTotal', {
                  total: selectedStops.length,
                })}
              </div>
              <SelectTerminalMemberStopsDropdown
                value={selectedStops}
                onChange={onSelectedStopsChange}
                testId={testIds.memberStops}
              />
            </div>
          </FormRow>
          <FormRow className="border-t border-light-grey p-4">
            <ValidityPeriodForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
          </FormRow>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const TerminalForm = forwardRef(TerminalFormComponent);
