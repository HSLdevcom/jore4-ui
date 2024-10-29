import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapLngLatToPoint } from '../../../../../utils';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { useShowStopAreaOnMap } from '../../../utils';
// Don't forget to remove the image from the repo!
import placeholderBg from '../PlaceholderMapFragment.png';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  openMapButton: 'StopAreaMinimap::openMapButton',
  marker: 'StopAreaMinimap::marker',
};

export const StopAreaMinimap: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();
  const showOnMap = useShowStopAreaOnMap();

  const point = mapLngLatToPoint(area.geometry?.coordinates ?? []);

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
        <span
          data-testid={testIds.marker}
          data-longitude={point.longitude}
          data-latitude={point.latitude}
        >
          {area.description?.value}
        </span>
      </div>

      <SlimSimpleButton
        className="absolute right-2 top-2"
        inverted
        onClick={() => showOnMap(area.id ?? undefined, point)}
        testId={testIds.openMapButton}
      >
        {t('stopAreaDetails.minimap.showOnMap')}
      </SlimSimpleButton>
    </div>
  );
};
