import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type ResultCountHeader = {
  readonly className?: string;
  readonly resultCount: number;
};

export const ResultCountHeader: FC<ResultCountHeader> = ({
  className,
  resultCount,
}) => {
  const { t } = useTranslation();

  return (
    <h2 className={className}>
      {t('stopRegistrySearch.resultCount', { count: resultCount })}
    </h2>
  );
};
