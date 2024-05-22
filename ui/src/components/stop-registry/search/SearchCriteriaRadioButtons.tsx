import { useTranslation } from 'react-i18next';

const SEARCH_BY = ['label', 'address'] as const;

export type SearchBy = (typeof SEARCH_BY)[number];

export const isSearchBy = (value: string): value is SearchBy => {
  return SEARCH_BY.includes(value as SearchBy);
};

const labelStyle =
  'mr-2 h-[20px] w-[20px] border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600';

export const SearchCriteriaRadioButtons = ({
  handleSearchByChange,
  searchBy,
}: {
  handleSearchByChange: (value: string) => void;
  searchBy: SearchBy;
}) => {
  const { t } = useTranslation();

  const searchByOptions = [
    {
      name: 'label',
      label: t('stopRegistrySearch.byLabel'),
    },
    {
      name: 'address',
      label: t('stopRegistrySearch.byAddress'),
    },
  ];

  return (
    <>
      {searchByOptions.map((option) => (
        <label htmlFor={option.name} className="inline-flex" key={option.name}>
          <input
            className={labelStyle}
            type="radio"
            id={option.name}
            data-testid={`SearchCriteriaRadioButtons::${option.name}`}
            name="searchBy"
            value={option.name}
            checked={searchBy === option.name}
            onChange={(e) => handleSearchByChange(e.target.value)}
          />
          {option.label}
        </label>
      ))}
    </>
  );
};
