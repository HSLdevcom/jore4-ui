import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdDelete, MdUndo } from 'react-icons/md';
import { Column, Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { FormColumn, FormRow, InputField } from '../../../forms/common';
import { LineTypeMultiSelectDropdown } from '../../../forms/timetables/LineTypeMultiSelectDropdown';
import { SubstituteDayOfWeekDropdown } from '../../../forms/timetables/SubstituteDayOfWeekDropdown';
import { FormState, PeriodType } from './OccasionalSubstitutePeriodForm.types';

interface Props {
  index: number;
  field: FieldArrayWithId<
    {
      periods: PeriodType[];
    },
    'periods',
    'id'
  >;
  remove: (index: number) => void;
  update: (index: number, flag: boolean) => void;
}

const testIds = {
  periodnameInput: 'OccasionalSubstitutePeriodRow::periodName',
  beginDate: 'OccasionalSubstitutePeriodRow::beginDate',
  beginTime: 'OccasionalSubstitutePeriodRow::beginTime',
  endDate: 'OccasionalSubstitutePeriodRow::endDate',
  endTime: 'OccasionalSubstitutePeriodRow::endTime',
  substituteDayOfWeek: 'OccasionalSubstitutePeriodRow::substituteDayOfWeek',
  lineTypes: 'OccasionalSubstitutePeriodRow::lineTypes',
  removeButton: 'OccasionalSubstitutePeriodRow::removeButton',
};

export const OccasionalSubstitutePeriodRow = ({
  index,
  field,
  remove,
  update,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<FormState>();
  const deleted = watch(`periods.${index}.deleted`);
  return (
    <FormRow mdColumns={12} className="my-4" key={field.id}>
      <FormColumn className="col-span-3">
        <InputField<FormState>
          type="text"
          fieldPath={`periods.${index}.periodName`}
          translationPrefix="timetables.settings"
          disabled={deleted}
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
          disabled={deleted}
        />
        <InputField<FormState>
          className="ml-2 h-9 w-1/3"
          type="text"
          fieldPath={`periods.${index}.beginTime`}
          translationPrefix="timetables.settings"
          testId={testIds.beginTime}
          disabled={deleted}
        />
      </div>
      <div className="col-span-2 flex">
        <InputField<FormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.endDate`}
          translationPrefix="timetables.settings"
          testId={testIds.endDate}
          disabled={deleted}
        />
        <InputField<FormState>
          className="ml-2 w-1/3"
          type="text"
          fieldPath={`periods.${index}.endTime`}
          translationPrefix="timetables.settings"
          testId={testIds.endTime}
          disabled={deleted}
        />
      </div>
      <InputField<FormState>
        translationPrefix="timetables.settings"
        className="col-span-2"
        testId={testIds.substituteDayOfWeek}
        fieldPath={`periods.${index}.substituteDayOfWeek`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <SubstituteDayOfWeekDropdown disabled={deleted} {...props} />
        )}
      />
      <InputField<FormState>
        className="col-span-2"
        translationPrefix="timetables.settings"
        testId={testIds.lineTypes}
        fieldPath={`periods.${index}.lineTypes`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <LineTypeMultiSelectDropdown
            disabled={deleted}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <Column className="col-span-1 justify-end">
        <input
          type="checkbox"
          hidden
          {...register(`periods.${index}.deleted`)}
        />
        <Visible visible={!!field.periodId}>
          <SimpleButton
            className="h-full px-3 text-xl"
            testId={testIds.removeButton}
            onClick={() => update(index, deleted)}
            inverted
          >
            {deleted ? <MdUndo aria-label="" /> : <MdDelete aria-label="" />}
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
