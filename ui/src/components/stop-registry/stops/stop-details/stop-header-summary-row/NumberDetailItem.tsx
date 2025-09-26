import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { TranslationKey } from '../../../../../i18n';

const testIds = {
  count: (prefix: string) => `${prefix}::count`,
};

type NumberDetailItemProps = {
  readonly count: number | null;
  readonly translationKey: TranslationKey;
  readonly testIdPrefix: string;
  readonly className?: string;
};

/**
 * Number detail item to use for lines, departures etc. on the highlight properties row.
 * If count is null '-' will be shown instead of a number.
 */
export const NumberDetailItem: FC<NumberDetailItemProps> = ({
  count,
  translationKey,
  testIdPrefix,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        'my-1 flex flex-col items-center justify-center text-dark-grey',
        className,
      )}
    >
      <p
        className="text-lg font-bold leading-none"
        data-testid={testIds.count(testIdPrefix)}
      >
        {count ?? '-'}
      </p>
      <p className="text-sm leading-none">{t(translationKey)}</p>
    </div>
  );
};
