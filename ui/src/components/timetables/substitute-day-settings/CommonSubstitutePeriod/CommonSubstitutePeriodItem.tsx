import { FC } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../time';
import { EditCloseButton } from '../../../../uiComponents/EditCloseButton';
import { InputField } from '../../../forms/common';
import { LineTypeMultiSelectDropdown } from '../../../forms/timetables/LineTypeMultiSelectDropdown';
import { SubstituteDayOfWeekDropdown } from '../../../forms/timetables/SubstituteDayOfWeekDropdown';
import {
  CommonDayType,
  FormState,
  UpdateField,
} from './CommonSubstitutePeriodForm.types';

const testIds = {
  periodContainer: (periodName: string) =>
    `CommonSubstitutePeriodItem::container::${periodName}`,
  periodName: 'CommonSubstitutePeriodItem::periodName',
  supersededDate: 'CommonSubstitutePeriodItem::supersededDate',
  substituteDayOfWeek:
    'CommonSubstitutePeriodItem::substituteDayOfWeekDropdown',
  lineTypes: 'CommonSubstitutePeriodItem::lineTypesDropdown',
  editCloseButton: 'CommonSubstitutePeriodItem::editCloseButton',
};

type CommonSubstitutePeriodItemProps = {
  readonly index: number;
  readonly field: FieldArrayWithId<
    {
      commonDays: ReadonlyArray<CommonDayType>;
    },
    'commonDays',
    'id'
  >;
  readonly update: (index: number, flag: boolean, field: UpdateField) => void;
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

export const CommonSubstitutePeriodItem: FC<
  CommonSubstitutePeriodItemProps
> = ({ index, field, update }) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<FormState>();
  const edited = watch(`commonDays.${index}.created`);
  const toBeDeleted = watch(`commonDays.${index}.toBeDeleted`) ?? false;
  const titleEdit = t(`accessibility:timetables.substituteDayEdit`, {
    substituteDay: field.periodName,
  });
  const titleCloseEdit = t(`accessibility:timetables.substituteDayEditClose`, {
    substituteDay: field.periodName,
  });

  return (
    <div
      className="flex basis-[28%] flex-wrap"
      key={field.id}
      data-testid={testIds.periodContainer(field.periodName)}
    >
      <PeriodNameAndDateLabel
        periodName={field.periodName}
        supersededDate={field.supersededDate}
      />
      <div className="flex basis-1/12 justify-end">
        {field.fromDatabase ? (
          <EditCloseButton
            titleEdit={titleEdit}
            titleClose={titleCloseEdit}
            showEdit={toBeDeleted}
            onEdit={() => update(index, toBeDeleted, 'toBeDeleted')}
            onClose={() => update(index, toBeDeleted, 'toBeDeleted')}
            testId={testIds.editCloseButton}
          />
        ) : (
          <EditCloseButton
            titleEdit={titleEdit}
            titleClose={titleCloseEdit}
            showEdit={!edited}
            onEdit={() => update(index, edited, 'created')}
            onClose={() => update(index, edited, 'created')}
            testId={testIds.editCloseButton}
          />
        )}
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
              disabled={
                (!field.fromDatabase && !edited) ||
                (field.fromDatabase && toBeDeleted)
              }
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
              disabled={
                (!field.fromDatabase && !edited) ||
                (field.fromDatabase && toBeDeleted)
              }
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
