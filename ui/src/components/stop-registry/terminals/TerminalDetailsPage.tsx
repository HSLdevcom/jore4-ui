import { FC, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useLoader } from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { LoadingState, Operation } from '../../../redux';
import { TerminalDetails } from './components/basic-details/TerminalDetailsSection';
import { TerminalExternalLinks } from './components/external-links/TerminalExternalLinks';
import { LocationDetails } from './components/location-details/LocationDetailsSection';
import { TerminalTitleRow } from './components/TerminalTitleRow';
import { TerminalVersioningRow } from './components/TerminalVersioningRow';
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

  if (loading && !parentStopPlaceDetails) {
    return null;
  }

  if (!parentStopPlaceDetails) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      <TerminalTitleRow terminal={parentStopPlaceDetails} />
      <hr />
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
    </Container>
  );
};
