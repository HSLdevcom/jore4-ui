import { useAppSelector, useMapQueryParams } from '../../hooks';
import { selectIsMapOperationLoading } from '../../redux';
import { LoadingOverlay } from '../../uiComponents';
import { useUiForE2e } from '../../utils/InitialUrParams';

const testIds = {
  loader: 'MapLoader::loader',
};

export const MapLoader = (): JSX.Element => {
  const { isMapOpen } = useMapQueryParams();
  const isLoading = useAppSelector(selectIsMapOperationLoading);

  // Set delay to 0 during e2e tests.
  // Current tests rely on the loader flashing on the screen.
  const loaderDelay = useUiForE2e() ? 0 : 200;

  return (
    <LoadingOverlay
      delay={loaderDelay}
      isLoading={isMapOpen && isLoading}
      testId={testIds.loader}
    />
  );
};
