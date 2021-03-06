import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../layoutComponents';
import { Priority } from '../../../../types/Priority';
import { SimpleButton } from '../../../../uiComponents';

type Props = {
  priorities: Priority[];
  onClick: (attributeName: string, value: Priority[]) => void;
};

export const PriorityCondition = ({
  priorities,
  onClick,
}: Props): JSX.Element => {
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
      priority: Priority.Draft,
      label: t('priority.draft'),
    },
    {
      priority: Priority.Temporary,
      label: t('priority.temporary'),
    },
  ];

  return (
    <Column>
      <h4 className="font-bold">{t('priority.label')}</h4>
      <Row className="space-x-2">
        {priorityButtonData.map((item) => (
          <SimpleButton
            onClick={() => onClickPriority(item.priority)}
            inverted={!priorities.includes(item.priority)}
            key={item.priority}
          >
            {item.label}
          </SimpleButton>
        ))}
      </Row>
    </Column>
  );
};
