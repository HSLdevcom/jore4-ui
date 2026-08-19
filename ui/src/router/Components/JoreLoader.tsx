import { FC } from 'react';
import { LoadingOverlay } from '../../components/common/Loaders';
import { selectIsJoreOperationLoading, useAppSelector } from '../../redux';

const testIds = {
  loader: 'JoreLoader::loader',
};

export const JoreLoader: FC = () => {
  const isLoading = useAppSelector(selectIsJoreOperationLoading);

  return <LoadingOverlay testId={testIds.loader} isLoading={isLoading} />;
};
