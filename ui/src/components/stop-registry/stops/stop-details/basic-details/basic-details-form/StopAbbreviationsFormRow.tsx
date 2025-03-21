import { Column } from '../../../../../../layoutComponents';
import { FormRow, InputField } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  abbreviationFin: 'StopBasicDetailsForm::abbreviationFin',
  abbreviationSwe: 'StopBasicDetailsForm::abbreviationSwe',
};
export const StopAbbreviationsFormRow = () => {
  return (
    <FormRow mdColumns={4}>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="abbreviationFin"
          testId={testIds.abbreviationFin}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="abbreviationSwe"
          testId={testIds.abbreviationSwe}
        />
      </Column>
    </FormRow>
  );
};
