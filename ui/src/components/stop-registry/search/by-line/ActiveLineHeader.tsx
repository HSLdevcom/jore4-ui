import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../time';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

const testIds = {
  name: 'StopSearchByLine::line::name',
  validity: 'StopSearchByLine::line::validity',
};

type ActiveLineHeaderProps = {
  readonly className?: string;
  readonly line: FindStopByLineInfo;
};

export const ActiveLineHeader: FC<ActiveLineHeaderProps> = ({
  className,
  line,
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('flex gap-4 bg-brand p-4 text-white', className)}>
      <div className="font-bold" data-testid={testIds.name}>
        {line.label} {line.name_i18n.fi_FI}
      </div>
      <div data-testid={testIds.validity}>
        {t('validity.validDuring', {
          startDate: mapToShortDate(line.validity_start),
          endDate: mapToShortDate(line.validity_end),
        })}
      </div>
    </div>
  );
};
