import { useTranslation } from 'react-i18next';

export const ResultsTableHeader = ({ count }: { count: number }) => {
  const { t } = useTranslation();
  return (
    <h1 className="mt-4 mb-4 text-2xl font-bold">
      {t('search.resultCount', {
        resultCount: count,
      })}
    </h1>
  );
};
