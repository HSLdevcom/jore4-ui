import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import {
  EnumDropdown,
  InputElement,
  InputField,
} from '../../../../forms/common';
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

interface Props {
  className?: string;
  defaultValues: Partial<SignageDetailsFormState>;
  onSubmit: (state: SignageDetailsFormState) => void;
}

const SignageDetailsFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const methods = useForm<SignageDetailsFormState>({
    defaultValues,
    resolver: zodResolver(signageDetailsFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <Row className="flex-wrap gap-10">
          <Column className="shrink gap-y-5">
            <Row className="flex flex-wrap gap-8">
              <InputField<SignageDetailsFormState>
                translationPrefix="stopDetails.signs"
                fieldPath="signType"
                testId={testIds.signType}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <EnumDropdown<StopPlaceSignType>
                    enumType={StopPlaceSignType}
                    placeholder={t('stopDetails.signs.signType')}
                    uiNameMapper={mapStopPlaceSignTypeToUiName}
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
            <Row className="flex flex-wrap gap-8">
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
              type="text"
              translationPrefix="stopDetails.signs"
              fieldPath="signageInstructionExceptions"
              testId={testIds.signageInstructionExceptions}
            />
          </Column>
        </Row>
      </form>
    </FormProvider>
  );
};

export const SignageDetailsForm = React.forwardRef(SignageDetailsFormComponent);
