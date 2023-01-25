import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

export const Loader = () => {
  const testIds = {
    loader: 'Loader::loader',
  };
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsOperationLoading);

  return (
    <LoadingOverlay testId={testIds.loader} visible={!isMapOpen && isLoading} />
  );
};
