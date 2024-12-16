import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { useGetStopDetails, useRequiredParams } from '../../../../hooks';
import { Container, Visible } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { ObservationDateControl } from '../../../common/ObservationDateControl';
import { FormRow } from '../../../forms/common';
import { BasicDetailsSection } from './basic-details/BasicDetailsSection';
import {
  DetailTabSelector,
  DetailTabType,
  detailTabs,
} from './DetailTabSelector';
import { SheltersInfoSpotsSection } from './info-spots/SheltersInfoSpots';
import { LocationDetailsSection } from './location-details/LocationDetailsSection';
import { MaintenanceSection } from './maintenance';
import { MeasurementsSection } from './measurements';
import { SheltersSection } from './shelters';
import { SignageDetailsSection } from './signage-details/SignageDetailsSection';
import { StopHeaderSummaryRow } from './StopHeaderSummaryRow';
import { StopTitleRow } from './title-row/StopTitleRow';

const testIds = {
  page: 'StopDetailsPage::page',
  validityPeriod: 'StopDetailsPage::validityPeriod',
  basicDetailsTabPanel: 'StopDetailsPage::basicDetailsTabPanel',
  technicalFeaturesTabPanel: 'StopDetailsPage::technicalFeaturesTabPanel',
  infoSpotsTabPanel: 'StopDetailsPage::infoSpotsTabPanel',
  loadingStopDetails: 'StopDetailsPage::loadingStopDetails',
};

export const StopDetailsPage = (): React.ReactElement => {
  const { stopDetails, loading } = useGetStopDetails();
  const { t } = useTranslation();
  const [activeDetailTab, selectDetailTab] = useState(
    DetailTabType.BasicDetailsTab,
  );
  const { label } = useRequiredParams<{ label: string }>();

  return (
    <Container testId={testIds.page}>
      <StopTitleRow stopDetails={stopDetails} label={label} />
      <StopHeaderSummaryRow className="my-2" stopDetails={stopDetails} />
      <FormRow mdColumns={6}>
        {/* TODO: Stop/Announcement/Breakroom/Lines tabs */}
        <ObservationDateControl className="col-start-6" />
      </FormRow>
      <hr className="my-4" />
      <div className="my-4 flex items-center">
        <h2 className="">{t('stopDetails.stopDetails')}</h2>
        <div
          className="ml-4"
          title={t('accessibility:stops.validityPeriod')}
          data-testid={testIds.validityPeriod}
        >
          {mapToShortDate(stopDetails?.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(stopDetails?.validity_end)}
        </div>
      </div>
      <DetailTabSelector
        className="mb-3"
        activeDetailTab={activeDetailTab}
        selectDetailTab={selectDetailTab}
      />
      <LoadingWrapper
        className="flex justify-center p-20"
        loading={loading}
        testId={testIds.loadingStopDetails}
      >
        {stopDetails && (
          <>
            <Visible visible={activeDetailTab === detailTabs.basic.type}>
              <div
                className="flex flex-col items-stretch gap-3"
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
                className="flex flex-col items-stretch gap-3"
                id={detailTabs.technical.panelId}
                data-testid={testIds.technicalFeaturesTabPanel}
                aria-labelledby={detailTabs.technical.buttonId}
                role="tabpanel"
              >
                <SheltersSection stop={stopDetails} />
                <MeasurementsSection stop={stopDetails} />
                <MaintenanceSection stop={stopDetails} />
              </div>
            </Visible>
            <Visible visible={activeDetailTab === detailTabs.info.type}>
              <div
                className="flex flex-col items-stretch gap-3"
                id={detailTabs.info.panelId}
                data-testid={testIds.infoSpotsTabPanel}
                aria-labelledby={detailTabs.info.buttonId}
                role="tabpanel"
              >
                <SheltersInfoSpotsSection stop={stopDetails} />
              </div>
            </Visible>
          </>
        )}
        {!stopDetails && (
          <div className="my-2 flex h-52 items-center justify-center rounded-md border border-light-grey bg-background">
            <span className="">
              <MdWarning
                className="mr-2 inline h-6 w-6 text-hsl-red"
                role="img"
                title={t('stopDetails.notValidOnObservationDate')}
              />
              {t('stopDetails.notValidOnObservationDate')}
            </span>
          </div>
        )}
      </LoadingWrapper>
    </Container>
  );
};
