import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../layoutComponents';
import { Priority } from '../../../../types/enums';
import { LabeledCheckbox } from '../../../forms/common';

const testIds = {
  priorityButton: (priority: Priority) =>
    `PriorityCondition::${Priority[priority]}PriorityButton`,
};

type PriorityConditionProps = {
  readonly priorities: ReadonlyArray<Priority>;
  readonly onClick: (attributeName: string, value: Priority[]) => void;
};

export const PriorityCondition: FC<PriorityConditionProps> = ({
  priorities,
  onClick,
}) => {
  const { t } = useTranslation();

  const onClickPriority = (priority: Priority) => {
    const newPriorities = priorities.includes(priority)
      ? priorities.filter((p) => p !== priority)
      : priorities.concat(priority);

    onClick('priorities', newPriorities);
  };

  const priorityButtonData: { priority: Priority; label: string }[] = [
    {
      priority: Priority.Standard,
      label: t('priority.standard'),
    },
    {
      priority: Priority.Temporary,
      label: t('priority.temporary'),
    },
    {
      priority: Priority.Draft,
      label: t('priority.draft'),
    },
  ];

  return (
    <Column>
      <fieldset>
        <legend className="font-bold">{t('priority.label')}</legend>
        <Row className="h-[--input-height] space-x-2">
          {priorityButtonData.map((item) => (
            <LabeledCheckbox
              label={item.label}
              onClick={() => onClickPriority(item.priority)}
              selected={priorities.includes(item.priority)}
              key={item.priority}
              testId={testIds.priorityButton(item.priority)}
            />
          ))}
        </Row>
      </fieldset>
    </Column>
  );
};
