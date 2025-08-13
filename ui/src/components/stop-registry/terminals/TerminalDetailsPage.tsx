import { FC, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useLoader } from '../../../hooks';
import { Container, Visible } from '../../../layoutComponents';
import { LoadingState, Operation } from '../../../redux';
import { navigationBlockerContext } from '../../forms/common/NavigationBlocker';
import { TerminalDetails } from './components/basic-details/TerminalDetailsSection';
import { TerminalExternalLinks } from './components/external-links/TerminalExternalLinks';
import { LocationDetails } from './components/location-details/LocationDetailsSection';
import { StopsListSection } from './components/member-stops/StopsListSection';
import { TerminalVersioningRow } from './components/terminal-versions';
import { TerminalTitleRow } from './components/TerminalTitleRow';
import { TabSelector, TabType, tabs } from './TabSelector';
import { useGetParentStopPlaceDetails } from './useGetTerminalDetails';

const testIds = {
  page: 'TerminalDetailsPage::page',
};

export const TerminalDetailsPage: FC<Record<string, never>> = () => {
  const { parentStopPlaceDetails, loading } = useGetParentStopPlaceDetails();

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

  const [activeDetailTab, setActiveDetailTab] = useState(
    TabType.BasicDetailsTab,
  );
  const { requestNavigation } = useContext(navigationBlockerContext);
  const selectDetailTab = (nextTab: TabType) =>
    requestNavigation(() => setActiveDetailTab(nextTab));

  if (loading && !parentStopPlaceDetails) {
    return null;
  }

  if (!parentStopPlaceDetails) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      <TerminalTitleRow terminal={parentStopPlaceDetails} />
      <TabSelector
        className="mb-3"
        activeTab={activeDetailTab}
        selectTab={selectDetailTab}
        stopsCount={(parentStopPlaceDetails.children ?? []).reduce(
          (sum, child) => sum + (child?.quays?.length ?? 0),
          0,
        )}
      />
      <hr />
      <Visible visible={activeDetailTab === tabs.basic.type}>
        <TerminalVersioningRow terminal={parentStopPlaceDetails} />
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="w-full space-y-4 md:w-[70%]">
            <TerminalDetails terminal={parentStopPlaceDetails} />
            <LocationDetails terminal={parentStopPlaceDetails} />
          </div>
          <div className="w-full md:w-[30%]">
            {parentStopPlaceDetails && (
              <TerminalExternalLinks terminal={parentStopPlaceDetails} />
            )}
          </div>
        </div>
      </Visible>
      <Visible visible={activeDetailTab === tabs.stops.type}>
        <StopsListSection terminal={parentStopPlaceDetails} />
      </Visible>
    </Container>
  );
};
