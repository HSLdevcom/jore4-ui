import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path } from '../../../../router/routeDetails';
import { getGeometryPoint } from '../../../../utils';
import { useShowStopAreaOnMap } from '../../utils';
import {
  StopPlaceHeader,
  StopPlaceHeaderPublicPropsProps,
} from '../components/StopPlaceSharedComponents/StopPlaceHeader';

export const StopAreaHeader: FC<StopPlaceHeaderPublicPropsProps> = ({
  className,
  isRounded,
  observationDate,
  onBatchUpdateSelection,
  stopIds,
  stopPlace,
  selection,
}) => {
  const { t } = useTranslation();

  const showOnMap = useShowStopAreaOnMap();
  const point = getGeometryPoint(stopPlace.centroid);

  const onShowOnMap = point
    ? () => showOnMap(stopPlace.netex_id ?? undefined, point)
    : noop;

  return (
    <StopPlaceHeader
      className={className}
      stopIds={stopIds}
      stopPlace={stopPlace}
      isRounded={isRounded}
      observationDate={observationDate}
      onBatchUpdateSelection={onBatchUpdateSelection}
      selection={selection}
      implementationProps={{
        colorClasses: 'border-light-grey bg-background',
        onShowOnMap,
        path: Path.stopAreaDetails,
        linkTitle: t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: stopPlace.name_value,
        }),
        linkContent: t('stopRegistrySearch.stopAreaLabel', {
          privateCode: stopPlace.private_code,
          name: stopPlace.name_value,
        }),
        showOnMapTooltip: t('stopRegistrySearch.showStopAreaOnMap'),
        menuShowDetails: t('stopRegistrySearch.stopAreaRowActions.openDetails'),
        menuShowOnMap: t('stopRegistrySearch.stopAreaRowActions.showOnMap'),
      }}
    />
  );
};
