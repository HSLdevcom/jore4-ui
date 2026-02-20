import { DateTime } from 'luxon';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { SortOrder } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { SimpleButton } from '../../../../../uiComponents';
import {
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../../../common/ChangeHistory';
import { useGetStopChangeHistoryItems } from '../queries/useGetStopChangeHistoryItems';
import { hasHistoryItemChanges } from '../utils/hasHistoryItemChanges';
import {
  CachedHistoricalStop,
  useHistoricalStopVersion,
} from './HistoricalStopDataProvider';
import { LatestStopChangeHistoryItem } from './LatestStopChangeHistoryItem';
import { usePrettyLoaderState } from './StopChangeHistoryTable';

const DataLoader: FC<{
  item: QuayChangeHistoryItem;
  index: number;
  onLoad: (index: number, data: CachedHistoricalStop) => void;
}> = ({ item, index, onLoad }) => {
  const data = useHistoricalStopVersion(item);
  useEffect(() => onLoad(index, data), [index, data, onLoad]);
  return null;
};

const FilteredHistoryItems: FC<{
  items: ReadonlyArray<QuayChangeHistoryItem>;
  getUserNameById: (userId: string | null | undefined) => string | null;
  maxItems: number;
  publicCode: string;
}> = ({ items, getUserNameById, maxItems, publicCode }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<CachedHistoricalStop[]>([]);

  const onLoad = useCallback((index: number, cached: CachedHistoricalStop) => {
    setData((prev) => {
      const next = [...prev];
      next[index] = cached;
      return next;
    });
  }, []);

  const limited = items.slice(0, 20);

  const toRender = useMemo(
    () =>
      limited
        .map((item, i) => ({
          item,
          previous: limited[i + 1] ?? null,
          curr: data[i],
          prev: data[i + 1],
        }))
        .filter(
          ({ previous, curr, prev }) =>
            !previous ||
            (curr?.status === 'fetched' &&
              prev?.status === 'fetched' &&
              hasHistoryItemChanges(t, prev.value, curr.value)),
        )
        .slice(0, maxItems),
    [limited, data, maxItems, t],
  );

  return (
    <>
      {limited.map((item, i) => (
        <DataLoader
          key={`${item.netexId}-${item.version}`}
          item={item}
          index={i}
          onLoad={onLoad}
        />
      ))}
      {toRender.map(({ item, previous }) => (
        <LatestStopChangeHistoryItem
          key={`${item.netexId}-${item.version}`}
          getUserNameById={getUserNameById}
          historyItem={item}
          previousHistoryItem={previous}
          publicCode={publicCode}
        />
      ))}
    </>
  );
};

const testIds = {
  container: 'LatestStopChangeHistoryTable::Container',
  title: 'LatestStopChangeHistoryTable::Title',
  loading: 'LatestStopChangeHistoryTable::Loading',
  failedToLoad: 'LatestStopChangeHistoryTable::FailedToLoad',
  retryButton: 'LatestStopChangeHistoryTable::RetryButton',
  showAllLink: 'LatestStopChangeHistoryTable::ShowAllLink',
};

type LatestStopChangeHistoryTableProps = {
  readonly publicCode: string;
  readonly className?: string;
};

export const LatestStopChangeHistoryTable: FC<
  LatestStopChangeHistoryTableProps
> = ({ publicCode, className }) => {
  const { t } = useTranslation();
  const { getUserNameById } = useGetUserNames();

  const sortingInfo: ChangeHistorySortingInfo = useMemo(
    () => ({
      sortBy: SortChangeHistoryBy.Changed,
      sortOrder: SortOrder.DESCENDING,
    }),
    [],
  );

  const { historyItems, loading, error, refetch } =
    useGetStopChangeHistoryItems({
      publicCode,
      filters: {
        from: DateTime.now().minus({ years: 10 }),
        to: DateTime.now(),
        priority: Priority.Standard,
      },
      sortingInfo,
    });

  const { showLoader, previousHistoryItems } = usePrettyLoaderState(
    loading,
    historyItems,
  );

  const displayItems = loading ? previousHistoryItems : historyItems;

  if (error) {
    return (
      <div
        className="mt-5 flex flex-col items-center justify-center"
        data-testid={testIds.failedToLoad}
      >
        <p>{t('changeHistory.failedToLoad')}</p>
        <SimpleButton
          className="mt-5"
          onClick={() => refetch()}
          testId={testIds.retryButton}
        >
          {t('changeHistory.tryAgainButton')}
        </SimpleButton>
      </div>
    );
  }

  if (showLoader) {
    return (
      <div className="mt-5 flex justify-center" data-testid={testIds.loading}>
        <p>{t('changeHistory.loading')}</p>
      </div>
    );
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t('stopChangeHistory.titleLatest')}
      </h3>
      <FilteredHistoryItems
        items={displayItems}
        getUserNameById={getUserNameById}
        maxItems={5}
        publicCode={publicCode}
      />
      <Link
        to={routeDetails[Path.stopChangeHistory].getLink(publicCode)}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t('stopChangeHistory.showAll')}
      </Link>
    </div>
  );
};
