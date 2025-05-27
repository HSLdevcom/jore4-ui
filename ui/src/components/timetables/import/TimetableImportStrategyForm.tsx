import { t } from 'i18next';
import { FC } from 'react';
import { z } from 'zod';
import { Row } from '../../../layoutComponents';
import { RadioButton } from '../../forms/common/RadioButton';

const testIds = {
  combineRadioButton: (prefix: string) => `${prefix}::combineRadioButton`,
  replaceRadioButton: (prefix: string) => `${prefix}::replaceRadioButton`,
};

type TimetableImportStrategyFormProps = {
  readonly testIdPrefix: string;
};

const TimetableImportStrategy = z.enum(['combine', 'replace']);
export type TimetableImportStrategy = z.infer<typeof TimetableImportStrategy>;

export const timetableImportStrategyFormSchema = z.object({
  timetableImportStrategy: TimetableImportStrategy,
});
export type TimetableImportStrategyFormState = z.infer<
  typeof timetableImportStrategyFormSchema
>;

export const TimetableImportStrategyForm: FC<
  TimetableImportStrategyFormProps
> = ({ testIdPrefix }) => {
  return (
    <Row className="items-center space-x-4">
      <Row className="items-center space-x-2">
        <label
          htmlFor="timetableImportStrategy.replace"
          className="text-base font-normal"
        >
          {t('confirmTimetablesImportModal.importStrategy.replace')}
        </label>
        <RadioButton
          fieldPath="timetableImportStrategy"
          id="timetableImportStrategy.replace"
          testId={testIds.replaceRadioButton(testIdPrefix)}
          value="replace"
        />
      </Row>
      <Row className="items-center space-x-2">
        <label
          htmlFor="timetableImportStrategy.combine"
          className="text-base font-normal"
        >
          {t('confirmTimetablesImportModal.importStrategy.combine')}
        </label>
        <RadioButton
          fieldPath="timetableImportStrategy"
          id="timetableImportStrategy.combine"
          testId={testIds.combineRadioButton(testIdPrefix)}
          value="combine"
        />
      </Row>
    </Row>
  );
};
