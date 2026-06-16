import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopRegistryTransportModeType } from '../../../../../../generated/graphql';
import { mapStopPlaceStateToUiName } from '../../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../../types';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import {
  EnumDropdown,
  FormActionButtons,
  FormColumn,
  FormRow,
  InputElement,
  InputField,
  ReasonForChangeForm,
} from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { StopAreaDetailsSection } from '../../basic-details/BasicDetailsStopAreaFields';
import { MirroredQuayFormState, mirroredQuayFormSchema } from './schema';

const testIds = {
  stopPlaceState: 'MirroredQuayForm::stopPlaceState',
  trunkLineStop: 'StopBasicDetailsForm::trunkLineStop',
  speedTramStop: 'StopBasicDetailsForm::speedTramStop',
};

type MirroredQuayBasicDetailsFormProps = {
  readonly defaultValues: Partial<MirroredQuayFormState>;
  readonly onSubmit: (state: MirroredQuayFormState) => void;
  readonly onCancel: () => void;
  readonly onRemove: () => void;
  readonly stop: StopWithDetails;
  readonly testIdPrefix: string;
  readonly transportMode: StopRegistryTransportModeType | null | undefined;
};

const MirroredQuayBasicDetailsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  MirroredQuayBasicDetailsFormProps
> = (
  {
    defaultValues,
    onSubmit,
    onCancel,
    onRemove,
    stop,
    testIdPrefix,
    transportMode,
  },
  ref,
) => {
  const { t } = useTranslation();

  const methods = useForm<MirroredQuayFormState>({
    defaultValues,
    resolver: zodResolver(mirroredQuayFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'MirroredQuayForm');
  const { handleSubmit } = methods;

  const isBusStop = transportMode === StopRegistryTransportModeType.Bus;
  const isTramStop = transportMode === StopRegistryTransportModeType.Tram;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <FormColumn>
          <StopAreaDetailsSection stop={stop} />
          <FormRow mdColumns={4}>
            <FormColumn>
              <InputField<MirroredQuayFormState>
                translationPrefix="stopDetails.basicDetails"
                fieldPath="stopState"
                testId={testIds.stopPlaceState}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <EnumDropdown<StopPlaceState>
                    enumType={StopPlaceState}
                    placeholder={t(($) => $.stopDetails.basicDetails.stopState)}
                    uiNameMapper={(value) =>
                      mapStopPlaceStateToUiName(t, value)
                    }
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
              />
            </FormColumn>

            <FormColumn className="justify-end">
              <label
                htmlFor="trunkLineStop"
                className="inline-flex font-normal"
              >
                <InputElement<MirroredQuayFormState>
                  type="checkbox"
                  id="trunkLineStop"
                  fieldPath="trunkLineStop"
                  className="mr-3.5 h-6 w-6"
                  testId={testIds.trunkLineStop}
                  disabled={!isBusStop}
                />
                {t(($) => $.stopPlaceTypes.trunkLineStop)}
              </label>
            </FormColumn>

            <FormColumn className="justify-end">
              <label
                htmlFor="speedTramStop"
                className="inline-flex font-normal"
              >
                <InputElement<MirroredQuayFormState>
                  type="checkbox"
                  id="speedTramStop"
                  fieldPath="speedTramStop"
                  className="mr-3.5 h-6 w-6"
                  testId={testIds.speedTramStop}
                  disabled={!isTramStop}
                />
                {t(($) => $.stopPlaceTypes.speedTramStop)}
              </label>
            </FormColumn>
          </FormRow>
          <ReasonForChangeForm />
        </FormColumn>
        <FormActionButtons
          onCancel={onCancel}
          onDelete={onRemove}
          deleteButtonText={t(($) => $.stopDetails.hybrid.removeButton)}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
          isSubmitting={methods.formState.isSubmitting}
          variant="infoContainer"
        />
      </form>
    </FormProvider>
  );
};

export const MirroredQuayBasicDetailsForm = forwardRef(
  MirroredQuayBasicDetailsFormComponent,
);
