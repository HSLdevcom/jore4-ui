import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { mapToShortDate, mapUTCToDateTime } from '../../../../../time';
import { StopAreaComponentProps } from '../types';

const testIds = {
  validityPeriod: 'StopAreaVersioningRow::validityPeriod',
  changeHistoryLink: 'StopAreaVersioningRow::changeHistoryLink',
};

export const StopAreaVersioningRow: FC<StopAreaComponentProps> = ({
  area,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('my-4 flex items-center gap-2', className)}>
      <h2>{t('stopAreaDetails.title')}</h2>

      <div
        title={t('accessibility:stops.validityPeriod')}
        data-testid={testIds.validityPeriod}
      >
        {mapToShortDate(area.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(area.validityEnd)}
      </div>

      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(area.privateCode?.value)}
        className="ml-auto flex items-center text-base text-tweaked-brand hover:underline"
        data-testid={testIds.changeHistoryLink}
      >
        {mapUTCToDateTime(area.changed)} | {area.changedByUserName ?? 'HSL'}{' '}
        <i className="icon-history text-xl" aria-hidden />
      </Link>
    </div>
  );
};
