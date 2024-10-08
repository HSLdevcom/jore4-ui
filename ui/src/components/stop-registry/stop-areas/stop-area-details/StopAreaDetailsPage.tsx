import { FC, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
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
import { useGetStopAreaDetails } from './useGetStopAreaDetails';

const testIds = {
  page: 'StopAreaDetailsPage::page',
};

export const StopAreaDetailsPage: FC<Record<string, never>> = () => {
  const { id } = useParams();

  const [blockInEdit, setBlockInEdit] = useState<StopAreaEditableBlock | null>(
    null,
  );

  const { area, loading, refetch } = useGetStopAreaDetails(id ?? '');
  const { setLoadingState } = useLoader(Operation.FetchStopAreaPageDetails, {
    initialState: area ? LoadingState.NotLoading : LoadingState.MediumPriority,
  });

  useEffect(() => {
    if (!loading) {
      setLoadingState(LoadingState.NotLoading);
    }
  }, [loading, setLoadingState]);

  if (loading && !area) {
    return null;
  }

  if (!area) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      <StopAreaTitleRow area={area} />
      <hr />
      <StopAreaVersioningRow area={area} />
      <StopAreaDetailsAndMap
        area={area}
        blockInEdit={blockInEdit}
        onEditBlock={setBlockInEdit}
        refetch={refetch}
      />
      <StopAreaMemberStops
        area={area}
        blockInEdit={blockInEdit}
        onEditBlock={setBlockInEdit}
        refetch={refetch}
      />
    </Container>
  );
};
