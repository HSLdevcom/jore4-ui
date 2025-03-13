import { Transition } from '@headlessui/react';
import { DateTime } from 'luxon';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../layoutComponents';
import { DateRange, SortOrder } from '../../../../../types';
import { ExpandButton } from '../../../../../uiComponents';
import { StopVersion, StopVersionTableSortingInfo } from '../types';
import { accordionClassNames, useSortedStopVersions } from '../utils';
import { DateRangeInputs } from './DateRangeInputs';
import { StopVersionTable } from './StopVersionTable';

const ID = 'ScheduledVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'ScheduledVersionsContainer::showHideButton',
  versionTable: 'ScheduledVersionsContainer::versionTable',
};

function useFilterVersionsByDateRange(
  stopVersions: ReadonlyArray<StopVersion>,
  dateRange: DateRange,
): ReadonlyArray<StopVersion> {
  const from = dateRange.startDate.valueOf();
  const to = dateRange.endDate.valueOf();

  return useMemo(() => {
    return stopVersions.filter((stopVersion) => {
      const stopFrom = stopVersion.validity_start.valueOf();
      const stopTo =
        stopVersion.validity_end?.valueOf() ?? Number.POSITIVE_INFINITY;

      return !(
        stopTo < from || // End before range start
        stopFrom > to // Starts after range end
      );
    });
  }, [stopVersions, from, to]);
}

function useControls() {
  const [expanded, setExpanded] = useState<boolean>(true);

  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    startDate: DateTime.now().minus({ month: 1 }).startOf('month'),
    endDate: DateTime.now().plus({ months: 12 }).endOf('month'),
  }));

  const [sortingInfo, setSortingInfo] = useState<StopVersionTableSortingInfo>({
    sortBy: 'VALIDITY_START',
    sortOrder: SortOrder.ASCENDING,
  });

  return {
    expanded,
    setExpanded,
    dateRange,
    setDateRange,
    setSortingInfo,
    sortingInfo,
  };
}

type ScheduledVersionsContainerProps = {
  readonly className?: string;
  readonly publicCode: string;
  readonly stopVersions: ReadonlyArray<StopVersion>;
};

export const ScheduledVersionsContainer: FC<
  ScheduledVersionsContainerProps
> = ({ className, publicCode, stopVersions }) => {
  const { t } = useTranslation();

  const {
    expanded,
    setExpanded,
    dateRange,
    setDateRange,
    sortingInfo,
    setSortingInfo,
  } = useControls();

  const filteredStopVersions = useFilterVersionsByDateRange(
    useSortedStopVersions(sortingInfo, stopVersions),
    dateRange,
  );

  return (
    <div className={className}>
      <Column>
        <h4 id={HeaderId}>{t('stopVersion.scheduled.title')}</h4>

        <DateRangeInputs
          className="mt-4 gap-4"
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <ExpandButton
          className="self-end"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t('stopVersion.scheduled.hide')}
          collapsedText={t('stopVersion.scheduled.show')}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
        />
      </Column>

      <Transition
        className="mt-2"
        id={ID}
        role="region"
        show={expanded}
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <StopVersionTable
          publicCode={publicCode}
          noVersionsText={t('stopVersion.scheduled.noVersions')}
          stopVersions={filteredStopVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testId={testIds.versionTable}
        />
      </Transition>
    </div>
  );
};
