import { z } from 'zod';
import { Column } from '../../../../../layoutComponents';
import { FormRow, InputField, requiredString } from '../../../common';

export const stopLabelAndNameSchema = z.object({
  publicCode: z.string().optional().nullable(),
  nameFin: requiredString,
  nameSwe: requiredString,
  label: requiredString,
});

export type StopLabelAndNameFormState = z.infer<typeof stopLabelAndNameSchema>;

const testIds = {
  label: 'StopLabelAndNameForm::label',
  publicCode: 'StopLabelAndNameForm::publicCode',
  nameFin: 'StopLabelAndNameForm::nameFin',
  nameSwe: 'StopLabelAndNameForm::nameSwe',
};

export const StopLabelAndNameForm = () => {
  return (
    <FormRow mdColumns={4}>
      <Column>
        <InputField<StopLabelAndNameFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="label"
          testId={testIds.label}
        />
      </Column>
      <Column>
        <InputField<StopLabelAndNameFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="publicCode"
          testId={testIds.publicCode}
        />
      </Column>
      <Column>
        <InputField<StopLabelAndNameFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameFin"
          testId={testIds.nameFin}
        />
      </Column>
      <Column>
        <InputField<StopLabelAndNameFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="nameSwe"
          testId={testIds.nameSwe}
        />
      </Column>
    </FormRow>
  );
};
