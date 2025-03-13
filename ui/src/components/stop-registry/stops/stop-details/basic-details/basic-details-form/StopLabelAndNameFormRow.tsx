import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../../layoutComponents';
import { FormRow, InputField } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  label: 'StopBasicDetailsForm::label',
  privateCode: 'StopBasicDetailsForm::privateCode',
  nameFin: 'StopBasicDetailsForm::nameFin',
  nameSwe: 'StopBasicDetailsForm::nameSwe',
};

export const StopLabelAndNameFormRow = () => {
  const { t } = useTranslation();
  return (
    <>
      <h3>{t('stopDetails.basicDetails.stopInformation')}</h3>
      <FormRow mdColumns={4}>
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
            fieldPath="nameFin"
            testId={testIds.nameFin}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="nameSwe"
            testId={testIds.nameSwe}
          />
        </Column>
      </FormRow>
    </>
  );
};
