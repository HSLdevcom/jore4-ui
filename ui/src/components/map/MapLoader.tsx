import { useAppSelector } from '../../hooks';
import { selectIsMapOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

export const MapLoader = () => {
  const isLoading = useAppSelector(selectIsMapOperationLoading);

  return <LoadingOverlay visible={isLoading} />;
};
