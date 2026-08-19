import { FC } from 'react';
import { selectMapOperationLoadingState, useAppSelector } from '../../redux';
import { LoadingOverlay } from '../common/Loaders';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader: FC = () => {
  const loadingState = useAppSelector(selectMapOperationLoadingState);

  return <LoadingOverlay loadingState={loadingState} testId={testIds.loader} />;
};
