import { FC } from 'react';
import { useAppSelector } from '../../hooks';
import { selectMapOperationLoadingState } from '../../redux';
import { LoadingOverlay } from '../common/Loaders';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader: FC = () => {
  const loadingState = useAppSelector(selectMapOperationLoadingState);

  return <LoadingOverlay loadingState={loadingState} testId={testIds.loader} />;
};
