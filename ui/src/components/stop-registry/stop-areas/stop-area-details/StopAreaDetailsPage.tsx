import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { LoadingState, Operation } from '../../../../redux';
import { useLoader } from '../../../common/hooks';
import { Container } from '../../../common/LayoutComponents';
import {
  StopAreaDetailsAndMap,
  StopAreaLatestChanges,
  StopAreaMemberStops,
  StopAreaTitleRow,
  StopAreaVersioningRow,
} from './components';
import { useGetStopPlaceDetails } from './useGetStopAreaDetails';

const testIds = {
  page: 'StopAreaDetailsPage::page',
};

export const StopAreaDetailsPage: FC<Record<string, never>> = () => {
  const { t } = useTranslation();

  const {
    stopPlaceDetails,
    loading,
    error,
    isValidOnObservationDate = false,
  } = useGetStopPlaceDetails();
  const { setLoadingState } = useLoader(Operation.FetchStopAreaPageDetails, {
    initialState: stopPlaceDetails
      ? LoadingState.NotLoading
      : LoadingState.MediumPriority,
  });

  useEffect(() => {
    if (!loading) {
      setLoadingState(LoadingState.NotLoading);
    }
  }, [loading, setLoadingState]);

  if (loading && !stopPlaceDetails) {
    return null;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      {stopPlaceDetails && (
        <>
          <StopAreaTitleRow area={stopPlaceDetails} />
          <hr />
          <StopAreaVersioningRow area={stopPlaceDetails} />
        </>
      )}
      {stopPlaceDetails && !error && isValidOnObservationDate && (
        <>
          <StopAreaDetailsAndMap area={stopPlaceDetails} />
          <div className="flex flex-col gap-3 lg:flex-row">
            <StopAreaMemberStops
              className="w-full lg:w-[70%]"
              area={stopPlaceDetails}
            />

            <StopAreaLatestChanges
              privateCode={stopPlaceDetails.privateCode?.value ?? ''}
              className="w-full border-b pb-2 lg:w-[30%]"
            />
          </div>
        </>
      )}
      {(!stopPlaceDetails ||
        Boolean(error) ||
        (stopPlaceDetails && !isValidOnObservationDate)) && (
        <div className="my-2 flex h-52 items-center justify-center rounded-md border border-light-grey bg-background">
          <span className="">
            <MdWarning
              className="mr-2 inline h-6 w-6 text-hsl-red"
              role="img"
              title={t(($) =>
                error
                  ? $.stopAreaDetails.errorWhileGettingStopAreaDetails
                  : $.stopAreaDetails.notValidOnObservationDate,
              )}
            />
            {t(($) =>
              error
                ? $.stopAreaDetails.errorWhileGettingStopAreaDetails
                : $.stopAreaDetails.notValidOnObservationDate,
            )}
          </span>
        </div>
      )}
    </Container>
  );
};
