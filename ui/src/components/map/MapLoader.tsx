import { useAppSelector, useMapQueryParams } from '../../hooks';
import { LoadingState, selectMapOperationLoadingState } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader = (): JSX.Element => {
  const { isMapOpen } = useMapQueryParams();
  const loadingState = useAppSelector(selectMapOperationLoadingState);

  return (
    <LoadingOverlay
      loadingState={isMapOpen ? loadingState : LoadingState.NotLoading}
      testId={testIds.loader}
    />
  );
};
