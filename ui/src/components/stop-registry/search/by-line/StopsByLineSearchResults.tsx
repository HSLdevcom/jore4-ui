import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { StopSearchFilters } from '../types';
import { ActiveLineHeader } from './ActiveLineHeader';
import { LineRoutesListing } from './LineRoutesListing';
import { LineSelector } from './LineSelector';
import { useFindLinesByStopSearch } from './useFindLinesByStopSearch';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopByLinesSearchResults',
};

type StopsByLineSearchResultsProps = { readonly filters: StopSearchFilters };

export const StopsByLineSearchResults: FC<StopsByLineSearchResultsProps> = ({
  filters,
}) => {
  const { t } = useTranslation();

  const { lines, loading } = useFindLinesByStopSearch(filters);

  const [activeLineId, setActiveLineId] = useState<UUID | null>(
    lines.at(0)?.line_id ?? null,
  );

  const lineToShow = lines.find((line) => line.line_id === activeLineId);

  // If lines list changes, check to see if the selected line is still within
  // the results, if not, then select the 1st line from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (
      lineToShow &&
      lines.some((line) => line.line_id === lineToShow.line_id)
    ) {
      return;
    }

    setActiveLineId(lines.at(0)?.line_id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      <LineSelector
        activeLineId={activeLineId}
        className="mb-6"
        lines={lines}
        setActiveLineId={setActiveLineId}
      />
      {lineToShow && <ActiveLineHeader line={lineToShow} />}
      {lineToShow && <LineRoutesListing line={lineToShow} />}
    </LoadingWrapper>
  );
};
