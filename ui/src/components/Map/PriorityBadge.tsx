import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Maybe } from '../../generated/graphql';
import { Priority } from '../../types/enums';
import { mapToValidityPeriod } from '../../utils';
import { mapPriorityToUiName } from '../../utils/i18n';
import { PrioritySymbol } from '../common/PrioritySymbol';

type PriorityBadgeProps = {
  readonly priority: Priority;
  readonly validityStart?: Maybe<Temporal.PlainDate>;
  readonly validityEnd?: Maybe<Temporal.PlainDate>;
};

export const PriorityBadge: FC<PriorityBadgeProps> = ({
  priority,
  validityStart,
  validityEnd,
}) => {
  const { t } = useTranslation();

  const title = `${mapPriorityToUiName(t, priority)}: ${mapToValidityPeriod(
    t,
    validityStart,
    validityEnd,
  )}`;

  return <PrioritySymbol priority={priority} title={title} />;
};
