import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../time';
import { TerminalComponentProps } from '../types';

const testIds = {
  validityPeriod: 'TerminalVersioningRow::validityPeriod',
};

export const TerminalVersioningRow: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('flex items-center', className)}>
      <h2>{t('terminalDetails.title')}</h2>

      <div
        className="ml-4"
        title={t('accessibility:stops.validityPeriod')}
        data-testid={testIds.validityPeriod}
      >
        {mapToShortDate(terminal.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(terminal.validityEnd)}
      </div>
    </div>
  );
};
