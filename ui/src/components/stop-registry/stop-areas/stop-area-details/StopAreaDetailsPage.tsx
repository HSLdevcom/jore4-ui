import { FC, useEffect } from 'react';
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
import { useGetStopAreaDetails } from './useGetStopAreaDetails';

const testIds = {
  page: 'StopAreaDetailsPage::page',
};

export const StopAreaDetailsPage: FC<Record<string, never>> = () => {
  const { id } = useParams();

  const { area, loading } = useGetStopAreaDetails(id ?? '');
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
    <Container testId={testIds.page}>
      <StopAreaTitleRow area={area} />
      <hr className="my-4" />
      <StopAreaVersioningRow area={area} className="mb-4" />
      <StopAreaDetailsAndMap area={area} className="mb-4" />
      <StopAreaMemberStops area={area} />
    </Container>
  );
};
