import { FC } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdDelete, MdUndo } from 'react-icons/md';
import { Column, Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { FormColumn, FormRow, InputField } from '../../../forms/common';
import { LineTypeMultiSelectDropdown } from '../../../forms/timetables/LineTypeMultiSelectDropdown';
import { SubstituteDayOfWeekDropdown } from '../../../forms/timetables/SubstituteDayOfWeekDropdown';
import { FormState, PeriodType } from './OccasionalSubstitutePeriodForm.types';

type OccasionalSubstitutePeriodRowProps = {
  readonly index: number;
  readonly field: FieldArrayWithId<
    {
      periods: ReadonlyArray<PeriodType>;
    },
    'periods',
    'id'
  >;
  readonly remove: (index: number) => void;
  readonly update: (index: number, flag: boolean) => void;
};

const testIds = {
  row: 'OccasionalSubstitutePeriodRow',
  periodnameInput: 'OccasionalSubstitutePeriodRow::periodName',
  beginDate: 'OccasionalSubstitutePeriodRow::beginDate',
  beginTime: 'OccasionalSubstitutePeriodRow::beginTime',
  endDate: 'OccasionalSubstitutePeriodRow::endDate',
  endTime: 'OccasionalSubstitutePeriodRow::endTime',
  substituteDayOfWeekDropdown:
    'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown',
  lineTypesDropdown: 'OccasionalSubstitutePeriodRow::lineTypesDropdown',
  removeButton: 'OccasionalSubstitutePeriodRow::removeButton',
};

export const OccasionalSubstitutePeriodRow: FC<
  OccasionalSubstitutePeriodRowProps
> = ({ index, field, remove, update }) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<FormState>();
  const tobeDeleted = watch(`periods.${index}.toBeDeleted`);
  return (
    <FormRow
      mdColumns={12}
      className="my-4"
      key={field.id}
      testId={testIds.row}
    >
      <FormColumn className="col-span-3">
        <InputField<FormState>
          type="text"
          fieldPath={`periods.${index}.periodName`}
          translationPrefix="timetables.settings"
          disabled={tobeDeleted}
          testId={testIds.periodnameInput}
        />
      </FormColumn>
      <div className="col-span-2 flex">
        <InputField<FormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.beginDate`}
          translationPrefix="timetables.settings"
          testId={testIds.beginDate}
          disabled={tobeDeleted}
        />
        <InputField<FormState>
          className="ml-2 h-9 w-1/3"
          type="text"
          fieldPath={`periods.${index}.beginTime`}
          translationPrefix="timetables.settings"
          testId={testIds.beginTime}
          disabled={tobeDeleted}
        />
      </div>
      <div className="col-span-2 flex">
        <InputField<FormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.endDate`}
          translationPrefix="timetables.settings"
          testId={testIds.endDate}
          disabled={tobeDeleted}
        />
        <InputField<FormState>
          className="ml-2 w-1/3"
          type="text"
          fieldPath={`periods.${index}.endTime`}
          translationPrefix="timetables.settings"
          testId={testIds.endTime}
          disabled={tobeDeleted}
        />
      </div>
      <InputField<FormState>
        translationPrefix="timetables.settings"
        className="col-span-2"
        testId={testIds.substituteDayOfWeekDropdown}
        fieldPath={`periods.${index}.substituteDayOfWeek`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <SubstituteDayOfWeekDropdown disabled={tobeDeleted} {...props} />
        )}
      />
      <InputField<FormState>
        className="col-span-2"
        translationPrefix="timetables.settings"
        testId={testIds.lineTypesDropdown}
        fieldPath={`periods.${index}.lineTypes`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <LineTypeMultiSelectDropdown
            disabled={tobeDeleted}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <Column className="col-span-1 justify-end">
        <input
          type="checkbox"
          hidden
          {...register(`periods.${index}.toBeDeleted`)}
        />
        <Visible visible={!!field.periodId}>
          <SimpleButton
            className="h-full px-3 text-xl"
            testId={testIds.removeButton}
            onClick={() => update(index, tobeDeleted)}
            inverted
          >
            {tobeDeleted ? (
              <MdUndo aria-label="" />
            ) : (
              <MdDelete aria-label="" />
            )}
          </SimpleButton>
        </Visible>
        <Visible visible={!field.periodId}>
          <SimpleButton
            className="h-full px-3 text-xl"
            testId={testIds.removeButton}
            onClick={() => remove(index)}
            inverted
          >
            <MdDelete aria-label={t('map.deleteRoute')} />
          </SimpleButton>
        </Visible>
      </Column>
    </FormRow>
  );
};
