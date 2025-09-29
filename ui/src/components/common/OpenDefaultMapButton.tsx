import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { FilterType, resetMapState, setStopFilterAction } from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { useNavigateToMap } from '../map/utils/useNavigateToMap';

type OpenDefaultMapButtonProps = {
  readonly containerClassName?: string;
  readonly testId?: string;
};

export const OpenDefaultMapButton = ({
  containerClassName,
  testId,
}: OpenDefaultMapButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigateToMap = useNavigateToMap();

  const onOpenMap = () => {
    dispatch(resetMapState());
    /**
     * By default only stops that belong to displayed route are shown on map.
     * Now that no routes are shown on map, show all stops by default.
     */
    dispatch(
      setStopFilterAction({
        filterType: FilterType.ShowAllBusStops,
        isActive: true,
      }),
    );

    navigateToMap();
  };

  return (
    <SimpleButton
      containerClassName={containerClassName}
      onClick={onOpenMap}
      testId={testId}
    >
      {t('map.open')}
    </SimpleButton>
  );
};
