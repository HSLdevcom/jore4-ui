import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import {
  EnumDropdown,
  FormActionButtons,
  InputElement,
  InputField,
  TextAreaElement,
} from '../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';
import { SignageDetailsFormState, signageDetailsFormSchema } from './schema';

const testIds = {
  numberOfFrames: 'SignageDetailsForm::numberOfFrames',
  replacesRailSign: 'SignageDetailsForm::replacesRailSign',
  signType: 'SignageDetailsForm::signType',
  signageInstructionExceptions:
    'SignageDetailsForm::signageInstructionExceptions',
};

type SignageDetailsFormProps = {
  readonly className?: string;
  readonly defaultValues: Partial<SignageDetailsFormState>;
  readonly onSubmit: (state: SignageDetailsFormState) => void;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
};

const SignageDetailsFormComponent: ForwardRefRenderFunction<
  ExplicitAny,
  SignageDetailsFormProps
> = ({ className, defaultValues, onSubmit, onCancel, testIdPrefix }, ref) => {
  const { t } = useTranslation();
  const methods = useForm<SignageDetailsFormState>({
    defaultValues,
    resolver: zodResolver(signageDetailsFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'SignageDetailsForm');
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <Row className="flex-wrap gap-10">
          <Column className="shrink gap-y-5">
            <Row className="flex-wrap gap-8">
              <InputField<SignageDetailsFormState>
                translationPrefix="stopDetails.signs"
                fieldPath="signType"
                testId={testIds.signType}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <EnumDropdown<StopPlaceSignType>
                    enumType={StopPlaceSignType}
                    placeholder={t('stopDetails.signs.signType')}
                    uiNameMapper={(value) =>
                      mapStopPlaceSignTypeToUiName(t, value)
                    }
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
              />
              <InputField<SignageDetailsFormState>
                type="number"
                translationPrefix="stopDetails.signs"
                min={0}
                fieldPath="numberOfFrames"
                inputClassName="w-1/2"
                testId={testIds.numberOfFrames}
              />
            </Row>
            <Row className="flex-wrap gap-8">
              <label
                htmlFor="replacesRailSign"
                className="inline-flex font-normal"
              >
                <InputElement<SignageDetailsFormState>
                  type="checkbox"
                  id="replacesRailSign"
                  fieldPath="replacesRailSign"
                  className="mr-2 h-6 w-6"
                  testId={testIds.replacesRailSign}
                />
                {t('stopDetails.signs.replacesRailSign')}
              </label>
            </Row>
          </Column>
          <Column className="h-auto grow">
            <InputField<SignageDetailsFormState>
              translationPrefix="stopDetails.signs"
              fieldPath="signageInstructionExceptions"
              testId={testIds.signageInstructionExceptions}
              className="h-full"
              // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unused-vars
              inputElementRenderer={({ fieldState, ...props }) => (
                <TextAreaElement
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                  fieldPath="signageInstructionExceptions"
                  className="h-full"
                />
              )}
            />
          </Column>
        </Row>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
        />
      </form>
    </FormProvider>
  );
};

export const SignageDetailsForm = forwardRef(SignageDetailsFormComponent);
