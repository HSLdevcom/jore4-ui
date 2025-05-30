import { Column } from '../../../../layoutComponents';
import { FormRow, InputField } from '../../../forms/common';
import { AlternativeNamesSchema } from './schema';

const testIds = {
  nameEng: 'AlternativeNamesEdit::nameEng',
  nameLongFin: 'AlternativeNamesEdit::nameLongFin',
  nameLongSwe: 'AlternativeNamesEdit::nameLongSwe',
  nameLongEng: 'AlternativeNamesEdit::nameLongEng',
  abbreviationFin: 'AlternativeNamesEdit::abbreviationFin',
  abbreviationSwe: 'AlternativeNamesEdit::abbreviationSwe',
  abbreviationEng: 'AlternativeNamesEdit::abbreviationEng',
};

export const AlternativeNamesEdit: React.FC = () => {
  return (
    <>
      <FormRow lgColumns={4} mdColumns={2}>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="nameLongFin"
            testId={testIds.nameLongFin}
          />
        </Column>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="nameLongSwe"
            testId={testIds.nameLongSwe}
          />
        </Column>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="abbreviationFin"
            testId={testIds.abbreviationFin}
          />
        </Column>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="abbreviationSwe"
            testId={testIds.abbreviationSwe}
          />
        </Column>
      </FormRow>
      <FormRow lgColumns={4} mdColumns={2}>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="nameEng"
            testId={testIds.nameEng}
          />
        </Column>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="nameLongEng"
            testId={testIds.nameLongEng}
          />
        </Column>
        <Column>
          <InputField<AlternativeNamesSchema>
            type="text"
            translationPrefix="stopDetails.alternativeNames"
            fieldPath="abbreviationEng"
            testId={testIds.abbreviationEng}
          />
        </Column>
      </FormRow>
    </>
  );
};
