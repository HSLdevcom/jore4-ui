import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'Loader::loader',
};

export const Loader = (): JSX.Element => {
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsOperationLoading);

  return (
    <LoadingOverlay testId={testIds.loader} visible={!isMapOpen && isLoading} />
  );
};
