import { Transition } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ExpandButton } from '../../../../uiComponents';
import { accordionClassNames } from '../../../common';
import { Column } from '../../../common/LayoutComponents';
import {
  DateRangeInputs,
  useFilterVersionsByDateRange,
  useSortedVersions,
  useVersionContainerControls,
} from '../../../common/versions';
import { RouteVersion } from '../types';
import { RouteVersionTable } from './RouteVersionTable';

const ID = 'ScheduledVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'ScheduledVersionsContainer::showHideButton',
  versionTable: 'ScheduledVersionsContainer::versionTable',
};

type ScheduledVersionsContainerProps = {
  readonly className?: string;
  readonly routeVersions: ReadonlyArray<RouteVersion>;
};

export const ScheduledVersionsContainer: FC<
  ScheduledVersionsContainerProps
> = ({ className, routeVersions }) => {
  const { t } = useTranslation();

  const {
    expanded,
    setExpanded,
    dateRange,
    setDateRange,
    sortingInfo,
    setSortingInfo,
  } = useVersionContainerControls();

  const filteredRouteVersions = useFilterVersionsByDateRange(
    useSortedVersions(sortingInfo, routeVersions),
    dateRange,
  );

  return (
    <div className={className}>
      <Column>
        <h4 id={HeaderId}>{t(($) => $.versions.scheduled.title)}</h4>

        <DateRangeInputs
          className="mt-4 gap-4"
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <ExpandButton
          className="mt-2 self-end"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t(($) => $.versions.scheduled.hide)}
          collapsedText={t(($) => $.versions.scheduled.show)}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
        />
      </Column>

      <Transition
        as="div"
        className="mt-2"
        id={ID}
        aria-labelledby={HeaderId}
        show={expanded}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <RouteVersionTable
          routeVersions={filteredRouteVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testId={testIds.versionTable}
          noVersionsText={t(($) => $.routeVersion.scheduled.noVersions)}
        />
      </Transition>
    </div>
  );
};
