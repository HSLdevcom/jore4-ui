import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { SimpleButton } from '../../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../../utils';
import { useShowStopAreaOnMap } from '../../../utils';
// Don't forget to remove the image from the repo!
import placeholderBg from '../PlaceholderMapFragment.png';
import { StopAreaComponentProps } from '../types';

const testIds = {
  openMapButton: 'StopAreaMinimap::openMapButton',
  marker: 'StopAreaMinimap::marker',
};

export const StopAreaMinimap: FC<StopAreaComponentProps> = ({
  area,
  className,
}) => {
  const { t } = useTranslation();
  const showOnMap = useShowStopAreaOnMap();

  const point = mapLngLatToPoint(area.geometry?.coordinates ?? []);

  return (
    <div
      className={twMerge(
        'relative flex h-[225px] w-2/6 items-center justify-center rounded-sm border bg-contain',
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
          data-longitude={area.locationLong}
          data-latitude={area.locationLat}
        >
          {area.name}
        </span>
      </div>

      <SimpleButton
        shape="slim"
        className="absolute top-2 right-2"
        inverted
        onClick={() => showOnMap(area.id ?? undefined, point)}
        testId={testIds.openMapButton}
      >
        {t('stopAreaDetails.minimap.showOnMap')}
      </SimpleButton>
    </div>
  );
};
