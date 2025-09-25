import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const testIds = {
  resultCount: 'StopSearchResultsPage::resultCount',
};

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
    <h2 className={className} data-testid={testIds.resultCount}>
      {t('stopRegistrySearch.resultCount', { count: resultCount })}
    </h2>
  );
};
