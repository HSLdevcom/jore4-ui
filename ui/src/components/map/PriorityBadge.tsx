import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDraftLine } from 'react-icons/ri';
import { Maybe } from '../../generated/graphql';
import { mapPriorityToUiName } from '../../i18n/uiNameMappings';
import { Priority } from '../../types/enums';
import { mapToValidityPeriod } from '../../utils';

type PriorityBadgeProps = {
  readonly priority: Priority;
  readonly validityStart?: Maybe<DateTime>;
  readonly validityEnd?: Maybe<DateTime>;
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

  switch (priority) {
    case Priority.Temporary:
      return (
        <i
          className="icon-temporary text-lg text-city-bicycle-yellow"
          title={title}
        />
      );
    case Priority.Draft:
      return (
        <RiDraftLine className="inline text-xl text-dark-grey" title={title} />
      );
    default:
      return null;
  }
};
