import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetStopDetails } from '../../../../hooks';
import { Container, Visible } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { BasicDetailsSection } from './basic-details/BasicDetailsSection';
import {
  DetailTabSelector,
  DetailTabType,
  detailTabs,
} from './DetailTabSelector';
import { LocationDetailsSection } from './location-details/LocationDetailsSection';
import { MeasurementsSection } from './measurements';
import { SheltersSection } from './shelters';
import { SignageDetailsSection } from './signage-details/SignageDetailsSection';
import { StopHeaderSummaryRow } from './StopHeaderSummaryRow';
import { StopTitleRow } from './StopTitleRow';

const testIds = {
  page: 'StopDetailsPage::page',
  validityPeriod: 'StopDetailsPage::validityPeriod',
  basicDetailsTabPanel: 'StopDetailsPage::basicDetailsTabPanel',
  technicalFeaturesTabPanel: 'StopDetailsPage::technicalFeaturesTabPanel',
  infoSpotsTabPanel: 'StopDetailsPage::infoSpotsTabPanel',
};

export const StopDetailsPage = (): JSX.Element => {
  const { stopDetails } = useGetStopDetails();
  const { t } = useTranslation();
  const [activeDetailTab, selectDetailTab] = useState(
    DetailTabType.BasicDetailsTab,
  );

  if (!stopDetails) {
    return <></>;
  }

  return (
    <Container testId={testIds.page}>
      <StopTitleRow stopDetails={stopDetails} />
      <StopHeaderSummaryRow className="my-2" stopDetails={stopDetails} />
      <hr className="my-4" />
      <div className="my-4 flex items-center">
        <h2 className="">{t('stopDetails.stopDetails')}</h2>
        <div
          className="ml-4"
          title={t('accessibility:stops.validityPeriod')}
          data-testid={testIds.validityPeriod}
        >
          {mapToShortDate(stopDetails.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(stopDetails.validity_end)}
        </div>
      </div>
      <DetailTabSelector
        activeDetailTab={activeDetailTab}
        selectDetailTab={selectDetailTab}
      />
      <Visible visible={activeDetailTab === detailTabs.basic.type}>
        <div
          id={detailTabs.basic.panelId}
          data-testid={testIds.basicDetailsTabPanel}
          aria-labelledby={detailTabs.basic.buttonId}
          role="tabpanel"
        >
          <BasicDetailsSection stop={stopDetails} />
          <LocationDetailsSection stop={stopDetails} />
          <SignageDetailsSection stop={stopDetails} />
        </div>
      </Visible>
      <Visible visible={activeDetailTab === detailTabs.technical.type}>
        <div
          id={detailTabs.technical.panelId}
          data-testid={testIds.technicalFeaturesTabPanel}
          aria-labelledby={detailTabs.technical.buttonId}
          role="tabpanel"
        >
          <SheltersSection stop={stopDetails} />
          <MeasurementsSection stop={stopDetails} />
        </div>
      </Visible>
      <Visible visible={activeDetailTab === detailTabs.info.type}>
        <div
          id={detailTabs.info.panelId}
          data-testid={testIds.infoSpotsTabPanel}
          aria-labelledby={detailTabs.info.buttonId}
          role="tabpanel"
        >
          TODO: Info spots
        </div>
      </Visible>
    </Container>
  );
};
