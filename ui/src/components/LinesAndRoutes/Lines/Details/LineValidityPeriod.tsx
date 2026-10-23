import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LineAllFieldsFragment } from '../../../../generated/graphql';
import { mapToShortDate } from '../../../../time/format';
import { Priority } from '../../../../types/enums';
import { mapPriorityToUiName } from '../../../../utils/i18n';
import { Row } from '../../../common/LayoutComponents';

const testIds = {
  validityPeriod: 'LineValidityPeriod::validityPeriod',
  priority: 'LineValidityPeriod::priority',
};

function buildValidityPeriod(
  validityStart?: Temporal.PlainDate | null,
  validityEnd?: Temporal.PlainDate | null,
) {
  return `${mapToShortDate(validityStart) ?? ''} - ${
    mapToShortDate(validityEnd) ?? ''
  }`;
}

type LineValidityPeriodProps = {
  readonly className?: string;
  readonly line: LineAllFieldsFragment;
};

export const LineValidityPeriod: FC<LineValidityPeriodProps> = ({
  className,
  line,
}) => {
  const { t } = useTranslation();

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
