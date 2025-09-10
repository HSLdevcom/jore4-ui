import { FC, useEffect, useId, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SearchFor, StopSearchFilters } from '../../types';
import { BasicFilters } from './BasicFilters';
import { ExtraFilters } from './ExtraFilters';

type StopSearchBarProps = {
  readonly initialFilters: StopSearchFilters;
  readonly searchIsExpanded: boolean;
  readonly toggleSearchIsExpanded: () => void;
  readonly onSubmit: (filters: StopSearchFilters) => void;
};

export const StopSearchBar: FC<StopSearchBarProps> = ({
  initialFilters,
  searchIsExpanded,
  toggleSearchIsExpanded,
  onSubmit,
}) => {
  const extraFiltersId = useId();

  const formRef = useRef<HTMLFormElement | null>(null);

  const methods = useForm<StopSearchFilters>({
    defaultValues: initialFilters,
  });

  // Previous implementation triggered the search when changing the searchBy value.
  // So, to remain compatible with existing test cases, this implementation needs,
  // to do the same.
  const [searchBy, query] = methods.watch(['searchBy', 'query']);
  useEffect(() => {
    if (initialFilters.searchBy !== searchBy && query !== '') {
      formRef.current?.requestSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBy]);

  const notForStops = methods.watch('searchFor') !== SearchFor.Stops;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className="container mx-auto flex flex-col py-10"
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <BasicFilters
          extraFiltersId={extraFiltersId}
          searchIsExpanded={searchIsExpanded}
          toggleSearchIsExpanded={toggleSearchIsExpanded}
        />

        <ExtraFilters
          id={extraFiltersId}
          notForStops={notForStops}
          searchIsExpanded={searchIsExpanded}
        />
      </form>
    </FormProvider>
  );
};
