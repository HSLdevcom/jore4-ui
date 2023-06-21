import { FieldArrayWithId } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Column } from '../../../../layoutComponents';
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
  handleRowRemove: (index: number, periodId: string | undefined) => void;
}

const testIds = {
  periodnameInput: 'OccasionalSubstitutePeriodRow::periodName',
  beginDate: 'OccasionalSubstitutePeriodRow::beginDate',
  beginTime: 'OccasionalSubstitutePeriodRow::beginTime',
  endDate: 'OccasionalSubstitutePeriodRow::endDate',
  endTime: 'OccasionalSubstitutePeriodRow::endTime',
  substituteDayOfWeek: 'OccasionalSubstitutePeriodRow::substituteDayOfWeek',
  lineTypes: 'OccasionalSubstitutePeriodRow::lineTypes',
  removeButton: 'RandomReferenceDayForm::removeButton',
};

export const OccasionalSubstitutePeriodRow = ({
  index,
  field,
  handleRowRemove,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <FormRow mdColumns={12} className="my-4">
      <FormColumn className="col-span-3">
        <InputField<FormState>
          type="text"
          fieldPath={`periods.${index}.periodName`}
          translationPrefix="timetables.settings"
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
        />
        <InputField<FormState>
          className="ml-2 h-9 w-1/3"
          type="text"
          fieldPath={`periods.${index}.beginTime`}
          translationPrefix="timetables.settings"
          testId={testIds.beginTime}
        />
      </div>
      <div className="col-span-2 flex">
        <InputField<FormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.endDate`}
          translationPrefix="timetables.settings"
          testId={testIds.endDate}
        />
        <InputField<FormState>
          className="ml-2 w-1/3"
          type="text"
          fieldPath={`periods.${index}.endTime`}
          translationPrefix="timetables.settings"
          testId={testIds.endTime}
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
          <SubstituteDayOfWeekDropdown {...props} />
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <Column className="col-span-1 justify-end">
        <SimpleButton
          className="h-full px-3 text-xl"
          testId={testIds.removeButton}
          onClick={() => handleRowRemove(index, field.periodId)}
          inverted
        >
          <MdDelete aria-label={t('map.deleteRoute')} />
        </SimpleButton>
      </Column>
    </FormRow>
  );
};
