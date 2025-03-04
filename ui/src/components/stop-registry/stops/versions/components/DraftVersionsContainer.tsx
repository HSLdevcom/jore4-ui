import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../../layoutComponents';
import { SortOrder } from '../../../../../types';
import { ExpandButton } from '../../../../../uiComponents';
import { StopVersion, StopVersionTableSortingInfo } from '../types';
import { getAccordionClassNames, useSortedStopVersions } from '../utils';
import { StopVersionTable } from './StopVersionTable';

const ID = 'DraftVersionsContainer';
const HeaderId = `${ID}-Header`;

const testIds = {
  showHideButton: 'DraftVersionsContainer::showHideButton',
};

function useControls() {
  const [expanded, setExpanded] = useState<boolean>(true);

  const [sortingInfo, setSortingInfo] = useState<StopVersionTableSortingInfo>({
    sortBy: 'VALIDITY_START',
    sortOrder: SortOrder.ASCENDING,
  });

  return {
    expanded,
    setExpanded,
    setSortingInfo,
    sortingInfo,
  };
}

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

  const { expanded, setExpanded, sortingInfo, setSortingInfo } = useControls();

  const sortedStopVersions = useSortedStopVersions(sortingInfo, stopVersions);

  return (
    <div className={className}>
      <Row className="justify-between">
        <h4 id={HeaderId}>{t('stopVersion.drafts.title')}</h4>

        <ExpandButton
          className="self-end"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t('stopVersion.drafts.hide')}
          collapsedText={t('stopVersion.drafts.show')}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
        />
      </Row>

      <div
        className={getAccordionClassNames(expanded)}
        id={ID}
        role="region"
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
      >
        <StopVersionTable
          publicCode={publicCode}
          noVersionsText={t('stopVersion.drafts.noVersions')}
          stopVersions={sortedStopVersions}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />
      </div>
    </div>
  );
};
