import { Transition } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../layoutComponents';
import { ExpandButton } from '../../../../uiComponents';
import { accordionClassNames } from '../../../common';
import { useVersionContainerControls } from '../../../common/versions';
import { RouteVersion } from '../types';
import { useSortedRouteVersions } from '../utils';
import { RouteVersionTable } from './RouteVersionTable';

const ID = 'DraftVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'DraftVersionsContainer::showHideButton',
  versionTable: 'DraftVersionsContainer::versionTable',
};

type DraftVersionsContainerProps = {
  readonly className?: string;
  readonly routeVersions: ReadonlyArray<RouteVersion>;
};

export const DraftVersionsContainer: FC<DraftVersionsContainerProps> = ({
  className,
  routeVersions,
}) => {
  const { t } = useTranslation();

  const { expanded, setExpanded, sortingInfo, setSortingInfo } =
    useVersionContainerControls();

  const sortedRouteVersions = useSortedRouteVersions(
    sortingInfo,
    routeVersions,
  );

  return (
    <div className={className}>
      <Row className="justify-between">
        <h4 id={HeaderId}>{t(($) => $.routeVersion.drafts.title)}</h4>

        <ExpandButton
          className="self-end"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t(($) => $.routeVersion.drafts.hide)}
          collapsedText={t(($) => $.routeVersion.drafts.show)}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
        />
      </Row>
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
          routeVersions={sortedRouteVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testId={testIds.versionTable}
        />
      </Transition>
    </div>
  );
};
