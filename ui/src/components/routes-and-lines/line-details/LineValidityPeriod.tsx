import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineDefaultFieldsFragment } from '../../../generated/graphql';
import { mapPriorityToUiName } from '../../../i18n/uiNameMappings';
import { Row } from '../../../layoutComponents';
import { DateLike, mapToShortDate } from '../../../time';
import { Priority } from '../../../types/enums';

const testIds = {
  validityPeriod: 'LineValidityPeriod::validityPeriod',
  priority: 'LineValidityPeriod::priority',
};

interface Props {
  className?: string;
  line: LineDefaultFieldsFragment;
}

export const LineValidityPeriod: React.FC<Props> = ({
  className = '',
  line,
}) => {
  const { t } = useTranslation();

  const buildValidityPeriod = (
    validityStart?: DateLike | null,
    validityEnd?: DateLike | null,
  ) =>
    `${mapToShortDate(validityStart) ?? ''} - ${
      mapToShortDate(validityEnd) ?? ''
    }`;

  return (
    <Row className={className}>
      {line.priority === Priority.Temporary && (
        <i className="icon-temporary text-xl text-city-bicycle-yellow" />
      )}
      {line.priority !== Priority.Standard && (
        <>
          <span className="font-bold" data-testid={testIds.priority}>
            {mapPriorityToUiName(t, line.priority)}
          </span>
          <span className="mx-1">|</span>
        </>
      )}
      <span data-testid={testIds.validityPeriod}>
        {buildValidityPeriod(line.validity_start, line.validity_end)}
      </span>
    </Row>
  );
};
