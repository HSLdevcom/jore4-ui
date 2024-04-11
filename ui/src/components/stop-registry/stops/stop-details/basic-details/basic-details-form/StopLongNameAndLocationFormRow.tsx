import { Column } from '../../../../../../layoutComponents';
import { FormRow, InputField } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  nameLongFin: 'StopBasicDetailsForm::nameLongFin',
  nameLongSwe: 'StopBasicDetailsForm::nameLongSwe',
  locationFin: 'StopBasicDetailsForm::locationFin',
  locationSwe: 'StopBasicDetailsForm::locationSwe',
};
export const StopLongNameAndLocationFormRow = () => {
  return (
    <FormRow mdColumns={4}>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameLongFin"
          testId={testIds.nameLongFin}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameLongSwe"
          testId={testIds.nameLongSwe}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="locationFin"
          testId={testIds.locationFin}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="locationSwe"
          testId={testIds.locationSwe}
        />
      </Column>
    </FormRow>
  );
};
