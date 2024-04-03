import { z } from 'zod';
import { Column } from '../../../../../layoutComponents';
import { FormRow, InputField } from '../../../common';

export const stopLocationAndAbbreviationsSchema = z.object({
  locationFin: z.string().optional(),
  locationSwe: z.string().optional(),
  nameLongFin: z.string().optional(),
  nameLongSwe: z.string().optional(),
  abbreviationFin: z.string().optional(),
  abbreviationSwe: z.string().optional(),
  abbreviation5CharFin: z.string().optional(),
  abbreviation5CharSwe: z.string().optional(),
});

export type StopLocationAndAbbreviationsFormState = z.infer<
  typeof stopLocationAndAbbreviationsSchema
>;
const testIds = {
  nameLongFin: 'StopLocationAndAbbreviationsForm::nameLongFin',
  nameLongSwe: 'StopLocationAndAbbreviationsForm::nameLongSwe',
  locationFin: 'StopLocationAndAbbreviationsForm::locationFin',
  locationSwe: 'StopLocationAndAbbreviationsForm::locationSwe',
  abbreviationFin: 'StopLocationAndAbbreviationsForm::abbreviationFin',
  abbreviationSwe: 'StopLocationAndAbbreviationsForm::abbreviationSwe',
  abbreviation5CharFin:
    'StopLocationAndAbbreviationsForm::abbreviation5CharFin',
  abbreviation5CharSwe:
    'StopLocationAndAbbreviationsForm::abbreviation5CharSwe',
};
export const StopLocationAndAbbreviationsForm = () => {
  return (
    <>
      <FormRow mdColumns={4}>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="nameLongFin"
            testId={testIds.nameLongFin}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="nameLongSwe"
            testId={testIds.nameLongSwe}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="locationFin"
            testId={testIds.locationFin}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="locationSwe"
            testId={testIds.locationSwe}
          />
        </Column>
      </FormRow>
      <FormRow mdColumns={4}>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="abbreviationFin"
            testId={testIds.abbreviationFin}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="abbreviationSwe"
            testId={testIds.abbreviationSwe}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="abbreviation5CharFin"
            testId={testIds.abbreviation5CharFin}
          />
        </Column>
        <Column>
          <InputField<StopLocationAndAbbreviationsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="abbreviation5CharSwe"
            testId={testIds.abbreviation5CharSwe}
          />
        </Column>
      </FormRow>
    </>
  );
};
