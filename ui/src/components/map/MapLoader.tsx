import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsMapOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

export const MapLoader = () => {
  const testIds = {
    loader: 'MapLoader::loader',
  };
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsMapOperationLoading);

  return (
    <LoadingOverlay testId={testIds.loader} visible={isMapOpen && isLoading} />
  );
};
