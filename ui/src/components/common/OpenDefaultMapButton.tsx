import { useTranslation } from 'react-i18next';
import { useAppDispatch, useFilterStops, useMapQueryParams } from '../../hooks';
import { FilterType, resetMapState } from '../../redux';
import { SimpleButton } from '../../uiComponents';

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
  const { addMapOpenQueryParameter } = useMapQueryParams();
  const { toggleFunction } = useFilterStops();
  const toggleShowAllStops = toggleFunction(FilterType.ShowAllBusStops);

  const onOpenMapModal = () => {
    dispatch(resetMapState());
    /**
     * By default only stops that belong to displayed route are shown on map.
     * Now that no routes are shown on map, show all stops by default.
     */
    toggleShowAllStops(true);

    addMapOpenQueryParameter();
  };

  return (
    <SimpleButton
      containerClassName={containerClassName}
      onClick={onOpenMapModal}
      testId={testId}
    >
      {t('map.open')}
    </SimpleButton>
  );
};