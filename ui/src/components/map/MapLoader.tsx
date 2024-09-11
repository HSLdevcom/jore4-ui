import { useAppSelector, useMapQueryParams } from '../../hooks';
import { LoadingState, selectMapLoaders, selectMapOperationLoadingState } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader = (): React.ReactElement => {
  const { isMapOpen } = useMapQueryParams();
  const loadingState = useAppSelector(selectMapOperationLoadingState);
  const activeLoaders = useAppSelector(selectMapLoaders);

  return (
    <LoadingOverlay
      loadingState={isMapOpen ? loadingState : LoadingState.NotLoading}
      activeLoaders={activeLoaders}
      testId={testIds.loader}
    />
  );
};
