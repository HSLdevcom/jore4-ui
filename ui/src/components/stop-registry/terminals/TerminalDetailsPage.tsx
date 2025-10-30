import compact from 'lodash/compact';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Container, Visible } from '../../../layoutComponents';
import { LoadingState, Operation } from '../../../redux';
import { useLoader } from '../../common/hooks';
import { navigationBlockerContext } from '../../forms/common/NavigationBlocker';
import { TerminalDetails } from './components/basic-details/TerminalDetailsSection';
import { TerminalExternalLinks } from './components/external-links/TerminalExternalLinks';
import { TerminalInfoSpotsSection } from './components/info-spots/TerminalInfoSpotsSection';
import { LocationDetails } from './components/location-details/LocationDetailsSection';
import { StopsListSection } from './components/member-stops/StopsListSection';
import { OwnerDetailsSection } from './components/owner-details/OwnerDetailsSection';
import { TerminalVersioningRow } from './components/terminal-versions';
import { TerminalTitleRow } from './components/TerminalTitleRow';
import {
  DetailTabSelector,
  DetailTabType,
  detailTabs,
} from './DetailTabSelector';
import { useGetParentStopPlaceDetails } from './hooks/useGetTerminalDetails';
import { TabType, tabs } from './TabSelector';

const testIds = {
  page: 'TerminalDetailsPage::page',
};

export const TerminalDetailsPage: FC<Record<string, never>> = () => {
  const { t } = useTranslation();
  const {
    parentStopPlaceDetails,
    loading,
    error,
    isValidOnObservationDate = false,
  } = useGetParentStopPlaceDetails();

  const { setLoadingState } = useLoader(Operation.FetchTerminalPageDetails, {
    initialState: parentStopPlaceDetails
      ? LoadingState.NotLoading
      : LoadingState.MediumPriority,
  });

  useEffect(() => {
    if (!loading) {
      setLoadingState(LoadingState.NotLoading);
    }
  }, [loading, setLoadingState]);

  const [activeTab, setActiveTab] = useState(TabType.BasicTab);
  const { requestNavigation } = useContext(navigationBlockerContext);
  const selectTab = (nextTab: TabType) =>
    requestNavigation(() => setActiveTab(nextTab));

  const [activeDetailTab, setActiveDetailTab] = useState(
    DetailTabType.BasicDetailsTab,
  );

  const selectDetailTab = (nextTab: DetailTabType) =>
    requestNavigation(() => setActiveDetailTab(nextTab));

  if (loading && !parentStopPlaceDetails) {
    return null;
  }

  const allInfoSpots = parentStopPlaceDetails
    ? [
        ...compact(parentStopPlaceDetails.infoSpots),
        ...compact(parentStopPlaceDetails.children).flatMap((child) =>
          compact(child.quays).flatMap((quay) => compact(quay.infoSpots)),
        ),
      ]
    : [];

  return (
    <Container className="space-y-4" testId={testIds.page}>
      {parentStopPlaceDetails && (
        <>
          <TerminalTitleRow
            terminal={parentStopPlaceDetails}
            activeTab={activeTab}
            selectTab={selectTab}
            stopsCount={(parentStopPlaceDetails.children ?? []).reduce(
              (sum, child) => sum + (child?.quays?.length ?? 0),
              0,
            )}
          />
          <hr />
        </>
      )}

      {parentStopPlaceDetails && !error && isValidOnObservationDate && (
        <>
          <Visible visible={activeTab === tabs.basic.type}>
            <TerminalVersioningRow terminal={parentStopPlaceDetails} />
            <DetailTabSelector
              className="mb-3"
              activeDetailTab={activeDetailTab}
              selectDetailTab={selectDetailTab}
            />
            <div className="flex flex-col gap-3 md:flex-row">
              <Visible visible={activeDetailTab === detailTabs.basic.type}>
                <div className="w-full space-y-4 md:w-[70%]">
                  <TerminalDetails terminal={parentStopPlaceDetails} />
                  <LocationDetails terminal={parentStopPlaceDetails} />
                  <OwnerDetailsSection terminal={parentStopPlaceDetails} />
                </div>
              </Visible>
              <Visible visible={activeDetailTab === detailTabs.info.type}>
                <div className="w-full space-y-4 md:w-[70%]">
                  <TerminalInfoSpotsSection
                    terminal={parentStopPlaceDetails}
                    infoSpots={allInfoSpots}
                  />
                </div>
              </Visible>
              <div className="w-full md:w-[30%]">
                {parentStopPlaceDetails && (
                  <TerminalExternalLinks terminal={parentStopPlaceDetails} />
                )}
              </div>
            </div>
          </Visible>
          <Visible visible={activeTab === tabs.stops.type}>
            <StopsListSection terminal={parentStopPlaceDetails} />
          </Visible>
        </>
      )}

      {(!parentStopPlaceDetails ||
        Boolean(error) ||
        (parentStopPlaceDetails && !isValidOnObservationDate)) && (
        <div className="my-2 flex h-52 items-center justify-center rounded-md border border-light-grey bg-background">
          <span className="">
            <MdWarning
              className="mr-2 inline h-6 w-6 text-hsl-red"
              role="img"
              title={t(
                error
                  ? 'terminalDetails.errorWhileGettingTerminalDetails'
                  : 'terminalDetails.notValidOnObservationDate',
              )}
            />
            {t(
              error
                ? 'terminalDetails.errorWhileGettingTerminalDetails'
                : 'terminalDetails.notValidOnObservationDate',
            )}
          </span>
        </div>
      )}
    </Container>
  );
};
