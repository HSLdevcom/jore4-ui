import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { mapToShortDate, mapUTCToDateTime } from '../../../../../time';
import { TerminalComponentProps } from '../../types';
import { EditTerminalValidityButton } from './EditTerminalValidityButton';

const testIds = {
  validityPeriod: 'TerminalVersioningRow::validityPeriod',
  changeHistoryLink: 'TerminalVersioningRow::changeHistoryLink',
};

export const TerminalVersioningRow: FC<TerminalComponentProps> = ({
  terminal,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('my-4 flex items-center gap-2', className)}>
      <h2>{t('terminalDetails.title')}</h2>

      <div
        title={t('accessibility:terminals.validityPeriod')}
        data-testid={testIds.validityPeriod}
      >
        {mapToShortDate(terminal.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(terminal.validityEnd)}
      </div>

      <EditTerminalValidityButton terminal={terminal} />

      <Link
        to={routeDetails[Path.terminalDetails].getLink(
          terminal.privateCode?.value,
        )}
        className="ml-auto flex items-center text-base text-tweaked-brand hover:underline"
        data-testid={testIds.changeHistoryLink}
      >
        {mapUTCToDateTime(terminal.changed)} |{' '}
        {terminal.changedByUserName ?? 'HSL'}{' '}
        <i className="icon-history text-xl" aria-hidden />
      </Link>
    </div>
  );
};
