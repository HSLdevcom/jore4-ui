import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { DetailTab } from '../components/DetailTab/DetailTab';

const testIds = {
  basicDetailsTabButton: 'TerminalDetailsPage::basicDetailsTabButton',
  infoSpotsTabButton: 'TerminalDetailsPage::infoSpotsTabButton',
};

export enum DetailTabType {
  BasicDetailsTab = 'BasicDetailsTab',
  InfoSpotsTab = 'InfoSpotsTab',
}

export const detailTabs = {
  basic: {
    type: DetailTabType.BasicDetailsTab,
    buttonId: 'detail-tab-basic',
    panelId: 'detail-tabpanel-basic',
  },
  info: {
    type: DetailTabType.InfoSpotsTab,
    buttonId: 'detail-tab-info',
    panelId: 'detail-tabpanel-info',
  },
};

type DetailTabSelectorProps = {
  readonly activeDetailTab: DetailTabType;
  readonly selectDetailTab: (tab: DetailTabType) => void;
  readonly className?: string;
};

export const DetailTabSelector: FC<DetailTabSelectorProps> = ({
  activeDetailTab,
  selectDetailTab,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge('space-x-2', className)}
      role="tablist"
      // Screen readers seem to require this since the buttons are not _direct_ children of this tablist.
      aria-owns={[detailTabs.basic.buttonId, detailTabs.info.buttonId].join(
        ' ',
      )}
    >
      <DetailTab
        id={detailTabs.basic.buttonId}
        tabPanelId={detailTabs.basic.panelId}
        testId={testIds.basicDetailsTabButton}
        title={t('terminalDetails.detailTabs.basic')}
        onClick={() => {
          selectDetailTab(DetailTabType.BasicDetailsTab);
        }}
        isActive={activeDetailTab === DetailTabType.BasicDetailsTab}
      />
      <DetailTab
        id={detailTabs.info.buttonId}
        tabPanelId={detailTabs.info.panelId}
        testId={testIds.infoSpotsTabButton}
        title={t('terminalDetails.detailTabs.info')}
        onClick={() => {
          selectDetailTab(DetailTabType.InfoSpotsTab);
        }}
        isActive={activeDetailTab === DetailTabType.InfoSpotsTab}
      />
    </div>
  );
};
