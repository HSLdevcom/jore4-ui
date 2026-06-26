import { Transition } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { accordionClassNames } from '../../../../common';
import { ExpandButton } from '../../../../common/Buttons';
import { Column } from '../../../../common/LayoutComponents';
import {
  DateRangeInputs,
  useFilterVersionsByDateRange,
  useSortedVersions,
  useVersionContainerControls,
} from '../../../../common/versions';
import { StopVersion } from '../types';
import { StopVersionTable } from './StopVersionTable';

const ID = 'ScheduledVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'ScheduledVersionsContainer::showHideButton',
  versionTable: 'ScheduledVersionsContainer::versionTable',
};

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
  } = useVersionContainerControls();

  const filteredStopVersions = useFilterVersionsByDateRange(
    useSortedVersions(sortingInfo, stopVersions),
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
          className="self-end"
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
        role="region"
        show={expanded}
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <StopVersionTable
          publicCode={publicCode}
          noVersionsText={t(($) => $.stopVersion.scheduled.noVersions)}
          stopVersions={filteredStopVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testId={testIds.versionTable}
        />
      </Transition>
    </div>
  );
};
