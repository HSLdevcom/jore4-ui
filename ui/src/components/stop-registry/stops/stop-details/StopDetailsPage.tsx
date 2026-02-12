import { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Link } from 'react-router';
import {
  makeBackNavigationIsSafeState,
  useRequiredParams,
} from '../../../../hooks';
import { Container, Visible } from '../../../../layoutComponents';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { mapToShortDate, mapUTCToDateTime } from '../../../../time';
import { Priority } from '../../../../types/enums';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { navigationBlockerContext } from '../../../forms/common/NavigationBlocker';
import { BasicDetailsSection } from './basic-details';
import {
  DetailTabSelector,
  DetailTabType,
  detailTabs,
} from './DetailTabSelector';
import { EditStopValidityButton } from './EditStopValidityButton';
import { StopExternalLinks } from './external-links/StopExternalLinks';
import { SheltersInfoSpotsSection } from './info-spots/SheltersInfoSpots';
import { LocationDetailsSection } from './location-details';
import { MaintenanceSection } from './maintenance';
import { MeasurementsSection } from './measurements';
import { SheltersSection } from './shelters';
import { SignageDetailsSection } from './signage-details';
import { StopHeaderSummaryRow } from './stop-header-summary-row';
import { StopDetailsVersion } from './StopDetailsVersion';
import { StopTitleRow } from './title-row/StopTitleRow';
import { useGetStopDetails } from './useGetStopDetails';

const testIds = {
  page: 'StopDetailsPage::page',
  versionsLink: 'StopDetailsPage::versionsLink',
  validityPeriod: 'StopDetailsPage::validityPeriod',
  basicDetailsTabPanel: 'StopDetailsPage::basicDetailsTabPanel',
  technicalFeaturesTabPanel: 'StopDetailsPage::technicalFeaturesTabPanel',
  infoSpotsTabPanel: 'StopDetailsPage::infoSpotsTabPanel',
  loadingStopDetails: 'StopDetailsPage::loadingStopDetails',
  changeHistoryLink: 'StopDetailsPage::changeHistoryLink',
};

export const StopDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { label } = useRequiredParams<{ label: string }>();

  const [activeDetailTab, setActiveDetailTab] = useState(
    DetailTabType.BasicDetailsTab,
  );
  const { requestNavigation } = useContext(navigationBlockerContext);
  const selectDetailTab = (nextTab: DetailTabType) =>
    requestNavigation(() => setActiveDetailTab(nextTab));

  const { stopDetails, loading, error } = useGetStopDetails();

  return (
    <Container testId={testIds.page}>
      <StopTitleRow stopDetails={stopDetails} label={label} />
      <StopHeaderSummaryRow className="my-2" stopDetails={stopDetails} />
      <StopDetailsVersion label={label} />
      <hr className="my-4" />
      <div className="my-4 flex">
        <div className="flex items-center gap-2">
          <h2>{t('stopDetails.stopDetails')}</h2>
          <div
            title={t('accessibility:stops.validityPeriod')}
            data-testid={testIds.validityPeriod}
          >
            {mapToShortDate(stopDetails?.validity_start)}
            <span className="mx-1">-</span>
            {mapToShortDate(stopDetails?.validity_end)}
          </div>
          <EditStopValidityButton stop={stopDetails} />
        </div>
        <Link
          to={routeDetails[Path.stopChangeHistory].getLink(label, {
            priority:
              stopDetails?.priority === Priority.Standard
                ? undefined
                : stopDetails?.priority,
          })}
          state={makeBackNavigationIsSafeState()}
          className="ml-auto flex items-center text-base text-tweaked-brand hover:underline"
          data-testid={testIds.changeHistoryLink}
        >
          {mapUTCToDateTime(stopDetails?.quay?.changed)} |{' '}
          {stopDetails?.quay?.changedByUserName ?? 'HSL'}{' '}
          <i className="icon-history text-xl" aria-hidden />
        </Link>
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
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="w-full md:w-[70%]">
            {stopDetails && !error && (
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
                <Visible
                  visible={activeDetailTab === detailTabs.technical.type}
                >
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
            {(!stopDetails || error) && (
              <div className="my-2 flex h-52 items-center justify-center rounded-md border border-light-grey bg-background">
                <span className="">
                  <MdWarning
                    className="mr-2 inline h-6 w-6 text-hsl-red"
                    role="img"
                    title={t(
                      error
                        ? 'stopDetails.errorWhileGettingStopDetails'
                        : 'stopDetails.notValidOnObservationDate',
                    )}
                  />
                  {t(
                    error
                      ? 'stopDetails.errorWhileGettingStopDetails'
                      : 'stopDetails.notValidOnObservationDate',
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="w-full md:w-[30%]">
            {stopDetails && <StopExternalLinks stop={stopDetails} />}
          </div>
        </div>
      </LoadingWrapper>
    </Container>
  );
};
