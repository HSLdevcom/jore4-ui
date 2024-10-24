import { useTranslation } from 'react-i18next';

export enum SearchBy {
  LabelOrName = 'labelOrName',
  Address = 'address',
  Line = 'line',
}

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
      name: SearchBy.LabelOrName,
      label: t('stopRegistrySearch.byLabel'),
    },
    {
      name: SearchBy.Address,
      label: t('stopRegistrySearch.byAddress'),
    },
    {
      name: SearchBy.Line,
      label: t('stopRegistrySearch.byLine'),
    },
  ];

  return (
    <div className="space-x-4">
      {searchByOptions.map((option) => (
        <label htmlFor={option.name} className="inline-flex" key={option.name}>
          <input
            className="mr-2 h-[20px] w-[20px] border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
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
    </div>
  );
};
