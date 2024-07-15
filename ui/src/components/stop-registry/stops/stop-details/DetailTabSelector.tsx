import { useTranslation } from 'react-i18next';
import { DetailTab } from './DetailTab';

const testIds = {
  basicDetailsTabButton: 'StopDetailsPage::basicDetailsTabButton',
  technicalFeaturesTabButton: 'StopDetailsPage::technicalFeaturesTabButton',
  infoSpotsTabButton: 'StopDetailsPage::infoSpotsTabButton',
};

export enum DetailTabType {
  BasicDetailsTab = 'BasicDetailsTab',
  TechnicalFeaturesTab = 'TechnicalFeaturesTab',
  InfoSpotsTab = 'InfoSpotsTab',
}

export const detailTabs = {
  basic: {
    type: DetailTabType.BasicDetailsTab,
    buttonId: 'detail-tab-basic',
    panelId: 'detail-tabpanel-basic',
  },
  technical: {
    type: DetailTabType.TechnicalFeaturesTab,
    buttonId: 'detail-tab-technical',
    panelId: 'detail-tabpanel-technical',
  },
  info: {
    type: DetailTabType.InfoSpotsTab,
    buttonId: 'detail-tab-info',
    panelId: 'detail-tabpanel-info',
  },
};

interface Props {
  activeDetailTab: DetailTabType;
  selectDetailTab: (tab: DetailTabType) => void;
  className?: string;
}

export const DetailTabSelector = ({
  activeDetailTab,
  selectDetailTab,
  className = '',
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div
      className={`space-x-2 ${className}`}
      role="tablist"
      // Screen readers seem to require this since the buttons are not _direct_ children of this tablist.
      aria-owns={[
        detailTabs.basic.buttonId,
        detailTabs.technical.buttonId,
        detailTabs.info.buttonId,
      ].join(' ')}
    >
      <DetailTab
        id={detailTabs.basic.buttonId}
        tabPanelId={detailTabs.basic.panelId}
        testId={testIds.basicDetailsTabButton}
        title={t('stopDetails.detailTabs.basic')}
        onClick={() => {
          selectDetailTab(DetailTabType.BasicDetailsTab);
        }}
        isActive={activeDetailTab === DetailTabType.BasicDetailsTab}
      />
      <DetailTab
        id={detailTabs.technical.buttonId}
        tabPanelId={detailTabs.technical.panelId}
        testId={testIds.technicalFeaturesTabButton}
        title={t('stopDetails.detailTabs.technical')}
        onClick={() => {
          selectDetailTab(DetailTabType.TechnicalFeaturesTab);
        }}
        isActive={activeDetailTab === DetailTabType.TechnicalFeaturesTab}
      />
      <DetailTab
        id={detailTabs.info.buttonId}
        tabPanelId={detailTabs.info.panelId}
        testId={testIds.infoSpotsTabButton}
        title={t('stopDetails.detailTabs.info')}
        onClick={() => {
          selectDetailTab(DetailTabType.InfoSpotsTab);
        }}
        isActive={activeDetailTab === DetailTabType.InfoSpotsTab}
      />
    </div>
  );
};
