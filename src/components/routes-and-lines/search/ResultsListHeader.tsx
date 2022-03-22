import { useTranslation } from 'react-i18next';

type Props = { count: number };

export const ResultsListHeader = ({ count }: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <h1 className="my-4 text-2xl font-bold">
      {t('search.resultCount', {
        resultCount: count,
      })}
    </h1>
  );
};
