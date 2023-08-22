import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { MdClose, MdEdit } from 'react-icons/md';
import { Visible } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { IconButton } from '../../../../uiComponents';
import { InputField } from '../../../forms/common';
import { LineTypeMultiSelectDropdown } from '../../../forms/timetables/LineTypeMultiSelectDropdown';
import { SubstituteDayOfWeekDropdown } from '../../../forms/timetables/SubstituteDayOfWeekDropdown';
import { CommonDayType, FormState } from './CommonSubstitutePeriodForm.types';

const testIds = {
  periodName: 'CommonSubstitutePeriodItem::periodName',
  supersededDate: 'CommonSubstitutePeriodItem::supersededDate',
  substituteDayOfWeek: 'CommonSubstitutePeriodItem::substituteDayOfWeek',
  lineTypes: 'CommonSubstitutePeriodItem::lineTypes',
  closeButton: 'CommonSubstitutePeriodItem::closeButton',
  editButton: 'CommonSubstitutePeriodItem::editButton',
};

interface Props {
  index: number;
  field: FieldArrayWithId<
    {
      commonDays: CommonDayType[];
    },
    'commonDays',
    'id'
  >;
  update: (index: number, flag: boolean) => void;
}

const EditAndRemoveButtons = ({
  showAnyButtons,
  created,
  index,
  update,
}: {
  showAnyButtons: boolean;
  created: boolean;
  index: number;
  update: (index: number, flag: boolean) => void;
}): JSX.Element => {
  return (
    <div className="flex justify-end">
      <Visible visible={showAnyButtons}>
        <Visible visible={!created}>
          <IconButton
            className="text-base font-bold text-brand"
            icon={<MdEdit />}
            onClick={() => update(index, created)}
            testId={testIds.editButton}
          />
        </Visible>
        <Visible visible={created}>
          <IconButton
            className="text-base font-bold text-brand"
            icon={<MdClose />}
            onClick={() => update(index, created)}
            testId={testIds.closeButton}
          />
        </Visible>
      </Visible>
    </div>
  );
};

const PeriodNameAndDateLabel = ({
  periodName,
  supersededDate,
}: {
  periodName: string;
  supersededDate: string;
}) => {
  return (
    <div className="mb-0 flex flex-col">
      <span className="font-semibold" data-testid={testIds.periodName}>
        {periodName}
      </span>
      <span data-testid={testIds.supersededDate}>
        {mapToShortDate(supersededDate)}
      </span>
    </div>
  );
};

export const CommonSubstitutePeriodItem = ({
  index,
  field,
  update,
}: Props): JSX.Element => {
  const { register, watch } = useFormContext<FormState>();
  const created = watch(`commonDays.${index}.created`);
  return (
    <div
      className="mr-8 mt-8 grid h-[20%] w-[30%] grid-cols-2 gap-0 gap-y-4"
      key={field.id}
    >
      <PeriodNameAndDateLabel
        periodName={field.periodName}
        supersededDate={field.supersededDate}
      />
      <EditAndRemoveButtons
        showAnyButtons={!field.fromDatabase}
        created={created}
        index={index}
        update={update}
      />
      <InputField<FormState>
        className="mr-4"
        translationPrefix="timetables.settings"
        testId={testIds.substituteDayOfWeek}
        fieldPath={`commonDays.${index}.substituteDayOfWeek`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <SubstituteDayOfWeekDropdown
            disabled={!field.fromDatabase && !created}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <InputField<FormState>
        translationPrefix="timetables.settings"
        testId={testIds.lineTypes}
        fieldPath={`commonDays.${index}.lineTypes`}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <LineTypeMultiSelectDropdown
            disabled={!field.fromDatabase && !created}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <input
        type="checkbox"
        hidden
        {...register(`commonDays.${index}.created`)}
      />
    </div>
  );
};
