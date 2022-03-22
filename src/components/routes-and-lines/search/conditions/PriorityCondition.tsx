import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../layoutComponents';
import { Priority } from '../../../../types/Priority';
import { SimpleButton, ValueFn } from '../../../../uiComponents';

export const PriorityCondition = ({
  priorities,
  onClick,
}: {
  priorities: Priority[];
  onClick: ValueFn;
}): JSX.Element => {
  const { t } = useTranslation();

  const onClickPriority = (priorityBeingChanged: Priority) => {
    const newPriorities = priorities.includes(priorityBeingChanged)
      ? priorities.filter((p) => p !== priorityBeingChanged)
      : priorities.concat(priorityBeingChanged);

    onClick('priorities', newPriorities);
  };

  const PriorityButton = (priority: Priority, label: string) => {
    return (
      <SimpleButton
        onClick={() => onClickPriority(priority)}
        inverted={!priorities.includes(priority)}
      >
        {label}
      </SimpleButton>
    );
  };
  const PriorityStandardButton = () =>
    PriorityButton(Priority.Standard, t('priority.standard'));

  const PriorityDraftButton = () =>
    PriorityButton(Priority.Draft, t('priority.draft'));

  const PriorityTemporaryButton = () =>
    PriorityButton(Priority.Temporary, t('priority.temporary'));

  return (
    <Column>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>{t('priority.label')}</label>
      <Row className="space-x-2">
        <PriorityStandardButton />
        <PriorityDraftButton />
        <PriorityTemporaryButton />
      </Row>
    </Column>
  );
};
