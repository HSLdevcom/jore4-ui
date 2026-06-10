import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceStateToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { StopWithDetails } from '../../../../../../types';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import {
  EnumDropdown,
  FormActionButtons,
  FormColumn,
  FormRow,
  InputField,
  ReasonForChangeForm,
} from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { StopAreaDetailsSection } from '../../basic-details/BasicDetailsStopAreaFields';
import { MirroredQuayFormState, mirroredQuayFormSchema } from './schema';

const testIds = {
  stopPlaceState: 'MirroredQuayForm::stopPlaceState',
};

type MirroredQuayBasicDetailsFormProps = {
  readonly defaultValues: Partial<MirroredQuayFormState>;
  readonly onSubmit: (state: MirroredQuayFormState) => void;
  readonly onCancel: () => void;
  readonly onRemove: () => void;
  readonly stop: StopWithDetails;
  readonly testIdPrefix: string;
};

const MirroredQuayBasicDetailsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  MirroredQuayBasicDetailsFormProps
> = (
  { defaultValues, onSubmit, onCancel, onRemove, stop, testIdPrefix },
  ref,
) => {
  const { t } = useTranslation();

  const methods = useForm<MirroredQuayFormState>({
    defaultValues,
    resolver: zodResolver(mirroredQuayFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'MirroredQuayForm');
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <FormColumn>
          <StopAreaDetailsSection stop={stop} />
          <FormRow mdColumns={4}>
            <Column>
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
            </Column>
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
