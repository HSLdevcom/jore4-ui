import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { SearchBy, SearchFor, StopSearchFilters } from '../../types';

function useOptions() {
  const { t } = useTranslation();

  return useMemo(
    () => [
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
    ],
    [t],
  );
}

type SearchCriteriaRadioButtonsProps = {
  readonly className?: string;
};

export const SearchCriteriaRadioButtons: FC<
  SearchCriteriaRadioButtonsProps
> = ({ className }) => {
  const { register, watch } = useFormContext<StopSearchFilters>();
  const disabled = watch('searchFor') !== SearchFor.Stops;

  const searchByOptions = useOptions();

  return (
    <div className={twMerge('flex space-x-4', className)}>
      {searchByOptions.map((option) => (
        <label
          htmlFor={option.name}
          className="inline-flex text-nowrap"
          key={option.name}
        >
          <input
            className="mr-2 h-[20px] w-[20px] border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            type="radio"
            id={option.name}
            data-testid={`SearchCriteriaRadioButtons::${option.name}`}
            value={option.name}
            disabled={disabled}
            {...register('searchBy')}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
