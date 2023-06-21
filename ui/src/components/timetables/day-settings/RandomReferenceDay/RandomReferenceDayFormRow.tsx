import { FieldArrayWithId } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Column } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { FormColumn, FormRow, InputField } from '../../../forms/common';
import { LineTypeMultiSelectDropdown } from '../../../forms/timetables/LineTypeMultiSelectDropdown';
import { SubstituteDayOfWeekDropdown } from '../../../forms/timetables/SubstituteDayOfWeekDropdown';
import {
  PeriodType,
  RandomReferenceFormState,
} from './RandomReferenceDayForm.types';

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
  periodnameInput: 'RandomReferenceDayForm::periodName',
  beginDate: 'RandomReferenceDayForm::beginDate',
  beginTime: 'RandomReferenceDayForm::beginTime',
  endDate: 'RandomReferenceDayForm::endDate',
  endTime: 'RandomReferenceDayForm::endTime',
  substituteDayOfWeek: 'RandomReferenceDayForm::substituteDayOfWeek',
  lineTypes: 'RandomReferenceDayForm::lineTypes',
  removeButton: 'RandomReferenceDayForm::removeButton',
};

export const RandomReferenceDayFormRow = ({
  index,
  field,
  handleRowRemove,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <FormRow mdColumns={12} className="my-4">
      <FormColumn className="col-span-3">
        <InputField<RandomReferenceFormState>
          type="text"
          fieldPath={`periods.${index}.periodName`}
          translationPrefix="timetables.settings"
          testId={testIds.periodnameInput}
        />
      </FormColumn>
      <div className="col-span-2 flex">
        <InputField<RandomReferenceFormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.beginDate`}
          translationPrefix="timetables.settings"
          testId={testIds.beginDate}
        />
        <InputField<RandomReferenceFormState>
          className="ml-2 h-9 w-1/3"
          type="text"
          fieldPath={`periods.${index}.beginTime`}
          translationPrefix="timetables.settings"
          testId={testIds.beginTime}
        />
      </div>
      <div className="col-span-2 flex">
        <InputField<RandomReferenceFormState>
          className="w-3/5"
          type="date"
          fieldPath={`periods.${index}.endDate`}
          translationPrefix="timetables.settings"
          testId={testIds.endDate}
        />
        <InputField<RandomReferenceFormState>
          className="ml-2 w-1/3"
          type="text"
          fieldPath={`periods.${index}.endTime`}
          translationPrefix="timetables.settings"
          testId={testIds.endTime}
        />
      </div>
      <InputField<RandomReferenceFormState>
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
      <InputField<RandomReferenceFormState>
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
      <Column className=" col-span-1  justify-end">
        <SimpleButton
          className="!px-3r h-full text-xl"
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
