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

const EditCloseButton = ({
  flag,
  onEdit,
  onClose,
}: {
  flag: boolean;
  onEdit: () => void;
  onClose: () => void;
}): JSX.Element => {
  return (
    <div>
      <Visible visible={flag}>
        <IconButton
          className="text-base font-bold text-brand"
          icon={<MdClose />}
          onClick={onClose}
          testId={testIds.closeButton}
        />
      </Visible>
      <Visible visible={!flag}>
        <IconButton
          className="text-base font-bold text-brand"
          icon={<MdEdit />}
          onClick={onEdit}
          testId={testIds.editButton}
        />
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
    <div className="flex-shrink-1 flex flex-grow-0 basis-11/12 flex-col">
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
    <div className="flex basis-[28%] flex-wrap" key={field.id}>
      <PeriodNameAndDateLabel
        periodName={field.periodName}
        supersededDate={field.supersededDate}
      />
      <div className="flex basis-1/12 justify-end">
        <Visible visible={!field.fromDatabase}>
          <EditCloseButton
            flag={created}
            onEdit={() => update(index, created)}
            onClose={() => update(index, created)}
          />
        </Visible>
      </div>
      <div className="flex basis-full gap-2">
        <InputField<FormState>
          className="basis-1/2"
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
          className="basis-1/2"
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
      </div>

      <input
        type="checkbox"
        hidden
        {...register(`commonDays.${index}.created`)}
      />
    </div>
  );
};
