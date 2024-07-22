import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsMapOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader = (): React.ReactElement => {
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsMapOperationLoading);

  return (
    <LoadingOverlay testId={testIds.loader} visible={isMapOpen && isLoading} />
  );
};
