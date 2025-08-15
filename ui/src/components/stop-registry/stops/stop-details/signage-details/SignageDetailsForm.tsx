import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import {
  EnumDropdown,
  InputElement,
  InputField,
  TextAreaElement,
} from '../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';
import { MainLineWarning } from '../MainLineWarning';
import { SignageDetailsFormState, signageDetailsFormSchema } from './schema';

const testIds = {
  numberOfFrames: 'SignageDetailsForm::numberOfFrames',
  mainLineSign: 'SignageDetailsForm::mainLineSign',
  replacesRailSign: 'SignageDetailsForm::replacesRailSign',
  lineSignage: 'SignageDetailsForm::lineSignage',
  signType: 'SignageDetailsForm::signType',
  signageInstructionExceptions:
    'SignageDetailsForm::signageInstructionExceptions',
};

type SignageDetailsFormProps = {
  readonly className?: string;
  readonly defaultValues: Partial<SignageDetailsFormState>;
  readonly onSubmit: (state: SignageDetailsFormState) => void;
  readonly isMainLineStop: boolean;
};

const SignageDetailsFormComponent: ForwardRefRenderFunction<
  ExplicitAny,
  SignageDetailsFormProps
> = ({ className = '', defaultValues, onSubmit, isMainLineStop }, ref) => {
  const { t } = useTranslation();
  const methods = useForm<SignageDetailsFormState>({
    defaultValues,
    resolver: zodResolver(signageDetailsFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'SignageDetailsForm');
  const { handleSubmit, watch } = methods;
  const hasMainLineSign = !!watch('mainLineSign');

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
              <label htmlFor="lineSignage" className="inline-flex font-normal">
                <InputElement<SignageDetailsFormState>
                  type="checkbox"
                  id="lineSignage"
                  fieldPath="lineSignage"
                  className="mr-2 h-6 w-6"
                  testId={testIds.lineSignage}
                />
                {t('stopDetails.signs.lineSignage')}
              </label>
              <label htmlFor="mainLineSign" className="inline-flex font-normal">
                <InputElement<SignageDetailsFormState>
                  type="checkbox"
                  id="mainLineSign"
                  fieldPath="mainLineSign"
                  className="mr-2 h-6 w-6"
                  testId={testIds.mainLineSign}
                />
                {t('stopDetails.signs.mainLineSign')}
                <MainLineWarning
                  className="ml-2"
                  isMainLineStop={isMainLineStop}
                  hasMainLineSign={hasMainLineSign}
                />
              </label>
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
      </form>
    </FormProvider>
  );
};

export const SignageDetailsForm = forwardRef(SignageDetailsFormComponent);
