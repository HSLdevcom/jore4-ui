import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  StopSearchResultStopsTable,
} from '../components';
import { StopAreaHeader } from './StopAreaHeader';
import { StopAreaSearchNoStops } from './StopAreaSearchNoStops';
import { FindStopAreaInfo } from './useFindStopAreas';
import { useGetStopResultByStopAreaId } from './useGetStopResultByStopAreaId';

const testIds = {
  loader: 'StopSearch::GroupedStops::loader',
};

type StopAreaStopsTableProps = {
  readonly className?: string;
  readonly stopArea: FindStopAreaInfo;
};

export const StopAreaStopsTable: FC<StopAreaStopsTableProps> = ({
  className,
  stopArea,
}) => {
  const { t } = useTranslation();

  const { error, loading, refetch, stops } = useGetStopResultByStopAreaId(
    stopArea.id,
  );

  return (
    <div className={className}>
      <StopAreaHeader
        stopArea={stopArea}
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
        <StopAreaSearchNoStops stopArea={stopArea} />
      </Visible>
    </div>
  );
};
