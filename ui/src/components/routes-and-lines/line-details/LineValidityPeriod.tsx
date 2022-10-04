import React from 'react';
import { RouteLine } from '../../../generated/graphql';
import { mapPriorityToUiName } from '../../../i18n/uiNameMappings';
import { Row } from '../../../layoutComponents';
import { DateLike, mapToShortDate } from '../../../time';
import { Priority } from '../../../types/Priority';

const testIds = {
  validityPeriod: 'LineValidityPeriod::validityPeriod',
  priority: 'LineValidityPeriod::priority',
};

interface Props {
  className?: string;
  line: RouteLine;
}

export const LineValidityPeriod: React.FC<Props> = ({
  className = '',
  line,
}) => {
  const buildValidityPeriod = (
    validityStart?: DateLike | null,
    validityEnd?: DateLike | null,
  ) =>
    `${mapToShortDate(validityStart) || ''} - ${
      mapToShortDate(validityEnd) || ''
    }`;

  return (
    <Row className={className}>
      {line.priority === Priority.Temporary && (
        <i className="icon-temporary text-xl text-city-bicycle-yellow" />
      )}
      {line.priority !== Priority.Standard && (
        <>
          <span className="font-bold" data-testid={testIds.priority}>
            {mapPriorityToUiName(line.priority)}
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
