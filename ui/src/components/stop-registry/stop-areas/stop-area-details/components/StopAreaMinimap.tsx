import { FC } from 'react';
// Don't forget to remove the image from the repo!
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import {
  useAppDispatch,
  useFilterStops,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../../../hooks';
import {
  FilterType,
  resetMapState,
  setSelectedMapStopAreaIdAction,
} from '../../../../../redux';
import { mapLngLatToPoint } from '../../../../../utils';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import placeholderBg from '../PlaceholderMapFragment.png';
import { StopAreaComponentProps } from './StopAreaComponentProps';

function useShowOnMap() {
  const dispatch = useAppDispatch();
  const { observationDate } = useObservationDateQueryParam();
  const { openMapWithParameters } = useMapQueryParams();
  const { toggleFunction } = useFilterStops();
  const toggleShowAllStops = toggleFunction(FilterType.ShowAllBusStops);

  return (area: StopAreaDetailsFragment) => {
    dispatch(resetMapState()).then(() => {
      dispatch(setSelectedMapStopAreaIdAction(area.id ?? undefined));
      toggleShowAllStops(false);

      const point = mapLngLatToPoint(area.geometry?.coordinates ?? []);
      openMapWithParameters({
        viewPortParams: {
          latitude: point.latitude,
          longitude: point.longitude,
          zoom: 18,
        },
        observationDate,
        displayedRouteParams: {},
      });
    });
  };
}

const testIds = {
  openMapButton: 'StopAreaMinimap::openMapButton',
};

export const StopAreaMinimap: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();
  const showOnMap = useShowOnMap();

  return (
    <div
      className={twMerge(
        'relative flex h-[225px] w-2/6 items-center justify-center rounded border bg-contain',
        className,
      )}
      style={{
        backgroundImage: `url(${placeholderBg.src})`,
      }}
    >
      <div className="text-center text-2xl font-extrabold">
        <span>🚧 Tähän tulee oikea kartta 🚧</span>
        <br />
        <span>{area.description?.value}</span>
      </div>

      <SlimSimpleButton
        className="absolute right-2 top-2"
        inverted
        onClick={() => showOnMap(area)}
        testId={testIds.openMapButton}
      >
        {t('stopAreaDetails.minimap.showOnMap')}
      </SlimSimpleButton>
    </div>
  );
};
