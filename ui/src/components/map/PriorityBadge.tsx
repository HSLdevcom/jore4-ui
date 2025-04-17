import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { RiDraftLine } from 'react-icons/ri';
import { Maybe } from '../../generated/graphql';
import { mapPriorityToUiName } from '../../i18n/uiNameMappings';
import { Priority } from '../../types/enums';
import { mapToValidityPeriod } from '../../utils';

export const PriorityBadge = ({
  priority,
  validityStart,
  validityEnd,
}: {
  priority: Priority;
  validityStart?: Maybe<DateTime>;
  validityEnd?: Maybe<DateTime>;
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
