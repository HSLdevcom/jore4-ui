import { Column } from '../../../../../../layoutComponents';
import { FormRow, InputField } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  abbreviationFin: 'StopBasicDetailsForm::abbreviationFin',
  abbreviationSwe: 'StopBasicDetailsForm::abbreviationSwe',
  abbreviation5CharFin: 'StopBasicDetailsForm::abbreviation5CharFin',
  abbreviation5CharSwe: 'StopBasicDetailsForm::abbreviation5CharSwe',
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
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="abbreviation5CharFin"
          testId={testIds.abbreviation5CharFin}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="abbreviation5CharSwe"
          testId={testIds.abbreviation5CharSwe}
        />
      </Column>
    </FormRow>
  );
};
