import { Transition } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../../layoutComponents';
import { ExpandButton } from '../../../../../uiComponents';
import { accordionClassNames } from '../../../../common';
import {
  useSortedVersions,
  useVersionContainerControls,
} from '../../../../common/versions';
import { StopVersion } from '../types';
import { StopVersionTable } from './StopVersionTable';

const ID = 'DraftVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'DraftVersionsContainer::showHideButton',
  versionTable: 'DraftVersionsContainer::versionTable',
};

type DraftVersionsContainerProps = {
  readonly className?: string;
  readonly publicCode: string;
  readonly stopVersions: ReadonlyArray<StopVersion>;
};

export const DraftVersionsContainer: FC<DraftVersionsContainerProps> = ({
  className,
  publicCode,
  stopVersions,
}) => {
  const { t } = useTranslation();

  const { expanded, setExpanded, sortingInfo, setSortingInfo } =
    useVersionContainerControls();

  const sortedStopVersions = useSortedVersions(sortingInfo, stopVersions);

  return (
    <div className={className}>
      <Row className="justify-between">
        <h4 id={HeaderId}>{t(($) => $.versions.drafts.title)}</h4>

        <ExpandButton
          className="self-end"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t(($) => $.versions.drafts.hide)}
          collapsedText={t(($) => $.versions.drafts.show)}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
        />
      </Row>
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
          noVersionsText={t(($) => $.stopVersion.drafts.noVersions)}
          stopVersions={sortedStopVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testId={testIds.versionTable}
        />
      </Transition>
    </div>
  );
};
