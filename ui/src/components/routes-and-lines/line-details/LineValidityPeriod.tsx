import { FC } from 'react';
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

type LineValidityPeriodProps = {
  readonly className?: string;
  readonly line: LineDefaultFieldsFragment;
};

export const LineValidityPeriod: FC<LineValidityPeriodProps> = ({
  className,
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
