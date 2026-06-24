import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceStateToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import {
  DateInputField,
  EnumDropdown,
  FormRow,
  InputField,
} from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  label: 'StopBasicDetailsForm::label',
  privateCode: 'StopBasicDetailsForm::privateCode',
  locationFin: 'StopBasicDetailsForm::locationFin',
  locationSwe: 'StopBasicDetailsForm::locationSwe',
  stopPlaceState: 'StopBasicDetailsForm::stopPlaceState',
  stopStateValidityStart: 'StopBasicDetailsForm::stopStateValidityStart',
  stopStateValidityEnd: 'StopBasicDetailsForm::stopStateValidityEnd',
};

export const StopLabelAndLocationFormRow = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<StopBasicDetailsFormState>();
  const stopState = watch('stopState');
  const showValidityPeriod = stopState !== StopPlaceState.InOperation;

  return (
    <>
      <h3>{t(($) => $.stopDetails.basicDetails.stopInformation)}</h3>
      <FormRow mdColumns={5}>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="label"
            // TODO: This is disabled until we add a confirmation dialog, because changing
            // the label of a stop will remove it from routes.
            disabled
            testId={testIds.label}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="privateCode"
            testId={testIds.privateCode}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="locationFin"
            testId={testIds.locationFin}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="locationSwe"
            testId={testIds.locationSwe}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            translationPrefix="stopDetails.basicDetails"
            fieldPath="stopState"
            testId={testIds.stopPlaceState}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<StopPlaceState>
                enumType={StopPlaceState}
                placeholder={t(($) => $.stopDetails.basicDetails.stopState)}
                uiNameMapper={(value) => mapStopPlaceStateToUiName(t, value)}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </Column>
      </FormRow>
      {showValidityPeriod && (
        <FormRow mdColumns={5}>
          <Column>
            <DateInputField<StopBasicDetailsFormState>
              translationPrefix="stopDetails.basicDetails"
              fieldPath="stopStateValidityStart"
              testId={testIds.stopStateValidityStart}
              required
            />
          </Column>
          <Column>
            <DateInputField<StopBasicDetailsFormState>
              translationPrefix="stopDetails.basicDetails"
              fieldPath="stopStateValidityEnd"
              testId={testIds.stopStateValidityEnd}
              required
            />
          </Column>
        </FormRow>
      )}
    </>
  );
};
