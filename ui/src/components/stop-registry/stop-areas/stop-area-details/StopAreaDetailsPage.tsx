import { FC, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useLoader } from '../../../../hooks';
import { Container } from '../../../../layoutComponents';
import { LoadingState, Operation } from '../../../../redux';
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
  const [blockInEdit, setBlockInEdit] = useState<StopAreaEditableBlock | null>(
    null,
  );

  const { stopPlaceDetails, loading, refetch } = useGetStopPlaceDetails();
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

  if (!stopPlaceDetails) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      <StopAreaTitleRow area={stopPlaceDetails} />
      <hr />
      <StopAreaVersioningRow area={stopPlaceDetails} />
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
    </Container>
  );
};
