import { ComponentType, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { LoadingStopsErrorRow } from '../LoadingStopsErrorRow';
import { StopSearchResultStopsTable } from '../StopSearchResultStopsTable';
import { FindStopPlaceInfo } from './useFindStopPlaces';
import { useGetStopResultById } from './useGetStopResultsById';

const testIds = {
  loader: 'StopSearch::GroupedStops::loader',
};

type StopsTableProps = {
  readonly className?: string;
  readonly stopPlace: FindStopPlaceInfo;
  readonly HeaderComponent: ComponentType<{
    stopPlace: FindStopPlaceInfo;
    isRounded: boolean;
  }>;
  readonly NoStopsComponent: ComponentType<{
    stopPlace: FindStopPlaceInfo;
  }>;
};

export const StopsTable: FC<StopsTableProps> = ({
  className,
  stopPlace,
  HeaderComponent,
  NoStopsComponent,
}) => {
  const { t } = useTranslation();

  const { error, loading, refetch, stops } = useGetStopResultById(stopPlace.id);

  return (
    <div className={className}>
      <HeaderComponent
        stopPlace={stopPlace}
        isRounded={!loading && stops.length === 0}
      />

      <Visible visible={!!error}>
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      </Visible>

      <LoadingWrapper
        testId={testIds.loader}
        className="flex justify-center border border-light-grey p-8"
        loadingText={t('search.searching')}
        loading={loading && stops.length === 0}
      >
        <Visible visible={stops.length > 0}>
          <StopSearchResultStopsTable stops={stops} />
        </Visible>
      </LoadingWrapper>

      <Visible visible={!loading && stops.length === 0}>
        <NoStopsComponent stopPlace={stopPlace} />
      </Visible>
    </div>
  );
};
