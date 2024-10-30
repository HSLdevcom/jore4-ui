import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { StopSearchFilters } from '../types';
import { StopAreaSelector } from './StopAreaSelector';
import { StopAreaStopsTable } from './StopAreaStopsTable';
import { useFindStopAreas } from './useFindStopAreas';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopAreaSearchResults',
};

type StopAreaSearchResultsProps = { readonly filters: StopSearchFilters };

export const StopAreaSearchResults: FC<StopAreaSearchResultsProps> = ({
  filters,
}) => {
  const { t } = useTranslation();

  const { stopAreas, loading } = useFindStopAreas(filters);

  const [activeAreaId, setActiveAreaId] = useState<string | null>(
    stopAreas.at(0)?.id.toString(10) ?? null,
  );

  const areaToShow = stopAreas.find(
    (area) => area.id.toString(10) === activeAreaId,
  );

  // If stop area list changes, check to see if the selected area is still within
  // the results, if not, then select the 1st area from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (
      areaToShow &&
      stopAreas.some((area) => area.id.toString(10) === areaToShow.id)
    ) {
      return;
    }

    setActiveAreaId(stopAreas.at(0)?.id.toString(10) ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopAreas]);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      <StopAreaSelector
        activeStopId={activeAreaId}
        className="mb-6"
        stopAreas={stopAreas}
        setActiveStopId={setActiveAreaId}
      />
      {areaToShow && <StopAreaStopsTable stopArea={areaToShow} />}
    </LoadingWrapper>
  );
};
