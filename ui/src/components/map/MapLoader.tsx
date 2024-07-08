import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsMapOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader = (): JSX.Element => {
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsMapOperationLoading);

  return (
    <LoadingOverlay
      delay={200}
      isLoading={isMapOpen && isLoading}
      testId={testIds.loader}
    />
  );
};
