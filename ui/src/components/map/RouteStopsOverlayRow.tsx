import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { mapFromStoreType, setStopOnRouteAction } from '../../redux';
import { RouteStop } from '../../redux/types';
import { AlignDirection, SimpleDropdownMenu } from '../../uiComponents';
import { PriorityBadge } from './PriorityBadge';

interface Props {
  routeStop: RouteStop;
  isReadOnly?: boolean;
}

const testId = {
  generate: (label: string) => `RouteStopsOverlayRow::${label}`,
};

export const RouteStopsOverlayRow = ({
  routeStop: { belongsToJourneyPattern, stop },
  isReadOnly,
}: Props) => {
  const { t } = useTranslation();

  const stopMetadata = mapFromStoreType(stop);
  const dispatch = useAppDispatch();

  const setOnRoute = (onRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: stopMetadata.label,
        belongsToJourneyPattern: onRoute,
      }),
    );
  };

  return (
    <div
      className="flex h-10 items-center justify-between border-b p-2"
      data-testid={testId.generate(stopMetadata.label)}
    >
      <div className="flex items-center">
        <div className="w-10">
          <PriorityBadge
            priority={stopMetadata.priority}
            validityStart={stopMetadata.validity_start}
            validityEnd={stopMetadata.validity_end}
          />
        </div>
        <div
          className={`text-sm font-bold ${
            belongsToJourneyPattern ? 'text-black' : 'text-gray-300'
          }`}
        >
          {stopMetadata.label}
        </div>
      </div>
      {!isReadOnly && (
        <div className="text-tweaked-brand">
          <SimpleDropdownMenu alignItems={AlignDirection.Left}>
            <button
              type="button"
              onClick={() => setOnRoute(!belongsToJourneyPattern)}
            >
              {belongsToJourneyPattern
                ? t('stops.removeFromRoute')
                : t('stops.addToRoute')}
            </button>
          </SimpleDropdownMenu>
        </div>
      )}
    </div>
  );
};
