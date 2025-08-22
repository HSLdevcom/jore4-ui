import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab } from '../components/Tab/Tab';

const testIds = {
  basicDetailsTabButton: 'TerminalDetailsPage::basicDetailsTabButton',
  stopsTabButton: 'TerminalDetailsPage::stopsTabButton',
};

export enum TabType {
  BasicTab = 'BasicTab',
  StopsTab = 'StopsTab',
}

export const tabs = {
  basic: {
    type: TabType.BasicTab,
    buttonId: 'detail-tab-basic',
    panelId: 'detail-tabpanel-basic',
  },
  stops: {
    type: TabType.StopsTab,
    buttonId: 'detail-tab-stops',
    panelId: 'detail-tabpanel-stops',
  },
};

type TabSelectorProps = {
  readonly activeTab: TabType;
  readonly selectTab: (tab: TabType) => void;
  readonly className?: string;
  readonly stopsCount?: number;
};

export const TabSelector: FC<TabSelectorProps> = ({
  activeTab,
  selectTab,
  stopsCount,
  className = '',
}) => {
  const { t } = useTranslation();
  const stopsTitle = Number.isFinite(stopsCount)
    ? t('terminalDetails.tabs.stopsWithCount', { count: stopsCount })
    : t('terminalDetails.tabs.stops');

  return (
    <div
      className={className}
      role="tablist"
      // Screen readers seem to require this since the buttons are not _direct_ children of this tablist.
      aria-owns={[tabs.basic.buttonId, tabs.stops.buttonId].join(' ')}
    >
      <Tab
        id={tabs.basic.buttonId}
        tabPanelId={tabs.basic.panelId}
        testId={testIds.basicDetailsTabButton}
        title={t('terminalDetails.tabs.basic')}
        className="rounded-br-none rounded-tr-none"
        onClick={() => {
          selectTab(TabType.BasicTab);
        }}
        isActive={activeTab === TabType.BasicTab}
      />
      <Tab
        id={tabs.stops.buttonId}
        tabPanelId={tabs.stops.panelId}
        testId={testIds.stopsTabButton}
        title={stopsTitle}
        className="rounded-bl-none rounded-tl-none"
        onClick={() => {
          selectTab(TabType.StopsTab);
        }}
        isActive={activeTab === TabType.StopsTab}
      />
    </div>
  );
};
