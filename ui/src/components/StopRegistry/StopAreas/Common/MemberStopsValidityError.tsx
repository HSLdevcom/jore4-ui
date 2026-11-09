import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToValidityPeriod } from '../../../../utils';
import { ValidationError } from '../../../common/Inputs';
import { ConflictingMemberStop } from './useMemberStopsValidityConflict';

type MemberStopsValidityErrorProps = {
  readonly className?: string;
  readonly conflictingMemberStops: ReadonlyArray<ConflictingMemberStop>;
};

/**
 * Lists the member stops whose validity periods are not covered by the stop
 * area's validity period.
 */
export const MemberStopsValidityError: FC<MemberStopsValidityErrorProps> = ({
  className,
  conflictingMemberStops,
}) => {
  const { t } = useTranslation();

  if (conflictingMemberStops.length === 0) {
    return null;
  }

  const stops = conflictingMemberStops
    .map((stop) =>
      compact([
        stop.publicCode,
        `(${mapToValidityPeriod(t, stop.validityStart, stop.validityEnd)})`,
      ]).join(' '),
    )
    .join(', ');

  return (
    <ValidationError
      className={className}
      fieldPath="memberStopsValidity"
      errorMessage={t(($) => $.stopArea.memberStopsValidityNotCovered, {
        stops,
      })}
    />
  );
};
