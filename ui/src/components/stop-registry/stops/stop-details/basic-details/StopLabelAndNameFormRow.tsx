import { Column } from '../../../../../layoutComponents';
import { FormRow, InputField } from '../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  label: 'StopBasicDetailsForm::label',
  publicCode: 'StopBasicDetailsForm::publicCode',
  nameFin: 'StopBasicDetailsForm::nameFin',
  nameSwe: 'StopBasicDetailsForm::nameSwe',
};

export const StopLabelAndNameFormRow = () => {
  return (
    <FormRow mdColumns={4}>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
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
          translationPrefix="stopDetails"
          fieldPath="publicCode"
          testId={testIds.publicCode}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameFin"
          testId={testIds.nameFin}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameSwe"
          testId={testIds.nameSwe}
        />
      </Column>
    </FormRow>
  );
};
