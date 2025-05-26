import { FC } from 'react';
import { useAppSelector } from '../../hooks';
import { selectIsJoreOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';

const testIds = {
  loader: 'JoreLoader::loader',
};

export const JoreLoader: FC = () => {
  const isLoading = useAppSelector(selectIsJoreOperationLoading);

  return <LoadingOverlay testId={testIds.loader} isLoading={isLoading} />;
};
