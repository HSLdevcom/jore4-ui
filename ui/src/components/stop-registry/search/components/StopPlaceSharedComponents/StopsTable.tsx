import { DateTime } from 'luxon';
import { ComponentType, FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { PgIdType, ResultSelection } from '../../types';
import { BatchUpdateSelection } from '../../utils';
import { LoadingStopsErrorRow } from '../LoadingStopsErrorRow';
import { SelectableStopSearchResultStopsTable } from '../StopSearchResultStopsTable';
import { StopPlaceHeaderPublicPropsProps } from './StopPlaceHeader';
import { NoStopsComponentProps } from './types';
import { FindStopPlaceInfo } from './useFindStopPlaces';
import { useGetStopResultById } from './useGetStopResultsById';

const testIds = {
  loader: 'StopSearch::GroupedStops::loader',
};

type StopsTableProps = {
  readonly className?: string;
  readonly observationDate: DateTime;
  readonly onBatchUpdateSelection: BatchUpdateSelection;
  readonly onToggleSelection: (rowId: string) => void;
  readonly onRegisterNewGroup: (
    stopPlaceId: PgIdType,
    ids: ReadonlyArray<string>,
  ) => void;
  readonly selection: ResultSelection;
  readonly stopPlace: FindStopPlaceInfo;
  readonly HeaderComponent: ComponentType<StopPlaceHeaderPublicPropsProps>;
  readonly NoStopsComponent: ComponentType<NoStopsComponentProps>;
};

export const StopsTable: FC<StopsTableProps> = ({
  className,
  observationDate,
  onBatchUpdateSelection,
  onRegisterNewGroup,
  onToggleSelection,
  selection,
  stopPlace,
  HeaderComponent,
  NoStopsComponent,
}) => {
  const { t } = useTranslation();

  const { error, loading, refetch, stops } = useGetStopResultById(stopPlace.id);

  const stopIds = useMemo(() => stops.map((stop) => stop.netexId), [stops]);

  useEffect(() => {
    onRegisterNewGroup(stopPlace.id, stopIds);

    // While it might initially seem like we should unregister the group
    // in this useEffect's cleanup-phase, we mustn't do that.
    // The cleanup phase happens not only when the dependencies change, but
    // also on unmount. But we must keep the registered data in the Router
    // history state even after unmount, in case we get a back navigation.
    // Unregistering only performed in StopGroupSelector component, when the
    // group actually gets unselected.
  }, [stopIds, onRegisterNewGroup, stopPlace.id]);

  return (
    <div className={className}>
      <HeaderComponent
        observationDate={observationDate}
        onBatchUpdateSelection={onBatchUpdateSelection}
        selection={selection}
        stopIds={stopIds}
        stopPlace={stopPlace}
        isRounded={!loading && stops.length === 0 && !error}
      />

      <Visible visible={!!error}>
        <LoadingStopsErrorRow
          className="ml-[calc(3rem+1px)]"
          error={error}
          refetch={refetch}
        />
      </Visible>

      <LoadingWrapper
        testId={testIds.loader}
        className="ml-[calc(3rem+1px)] flex justify-center border border-light-grey p-8"
        loadingText={t('search.searching')}
        loading={loading && stops.length === 0}
      >
        <Visible visible={stops.length > 0}>
          <SelectableStopSearchResultStopsTable
            observationDate={observationDate}
            onToggleSelection={onToggleSelection}
            selection={selection}
            stops={stops}
          />
        </Visible>
      </LoadingWrapper>

      <Visible visible={!loading && stops.length === 0}>
        <NoStopsComponent
          className="ml-[calc(3rem+1px)]"
          stopPlace={stopPlace}
        />
      </Visible>
    </div>
  );
};
