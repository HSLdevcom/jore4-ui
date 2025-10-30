import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Container } from '../../../../layoutComponents';
import { LoadingState, Operation } from '../../../../redux';
import { useLoader } from '../../../common/hooks';
import {
  StopAreaDetailsAndMap,
  StopAreaMemberStops,
  StopAreaTitleRow,
  StopAreaVersioningRow,
} from './components';
import { StopAreaEditableBlock } from './StopAreaEditableBlock';
import { useGetStopPlaceDetails } from './useGetStopAreaDetails';

const testIds = {
  page: 'StopAreaDetailsPage::page',
};

export const StopAreaDetailsPage: FC<Record<string, never>> = () => {
  const { t } = useTranslation();
  const [blockInEdit, setBlockInEdit] = useState<StopAreaEditableBlock | null>(
    null,
  );

  const {
    stopPlaceDetails,
    loading,
    error,
    refetch,
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
          <StopAreaDetailsAndMap
            area={stopPlaceDetails}
            blockInEdit={blockInEdit}
            onEditBlock={setBlockInEdit}
            refetch={refetch}
          />
          <StopAreaMemberStops
            area={stopPlaceDetails}
            blockInEdit={blockInEdit}
            onEditBlock={setBlockInEdit}
            refetch={refetch}
          />
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
              title={t(
                error
                  ? 'stopAreaDetails.errorWhileGettingStopAreaDetails'
                  : 'stopAreaDetails.notValidOnObservationDate',
              )}
            />
            {t(
              error
                ? 'stopAreaDetails.errorWhileGettingStopAreaDetails'
                : 'stopAreaDetails.notValidOnObservationDate',
            )}
          </span>
        </div>
      )}
    </Container>
  );
};
