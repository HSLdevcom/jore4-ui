import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path } from '../../../../router/routeDetails';
import { getGeometryPoint } from '../../../../utils';
import { useShowTerminalOnMap } from '../../utils/useShowTerminalOnMap';
import {
  StopPlaceHeader,
  StopPlaceHeaderPublicPropsProps,
} from '../components/StopPlaceSharedComponents/StopPlaceHeader';

export const TerminalHeader: FC<StopPlaceHeaderPublicPropsProps> = ({
  className,
  isRounded,
  observationDate,
  onBatchUpdateSelection,
  stopIds,
  stopPlace,
  selection,
}) => {
  const { t } = useTranslation();

  const showOnMap = useShowTerminalOnMap();
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
        colorClasses:
          'border-border-hsl-commuter-train-purple bg-background-hsl-commuter-train-purple',
        onShowOnMap,
        path: Path.terminalDetails,
        linkTitle: t('accessibility:terminals.showTerminalDetails', {
          areaLabel: stopPlace.name_value,
        }),
        linkContent: t('stopRegistrySearch.terminalLabel', {
          privateCode: stopPlace.private_code,
          name: stopPlace.name_value,
        }),
        showOnMapTooltip: t('stopRegistrySearch.terminalRowActions.showOnMap'),
        menuShowDetails: t('stopRegistrySearch.terminalRowActions.openDetails'),
        menuShowOnMap: t('stopRegistrySearch.terminalRowActions.showOnMap'),
      }}
    />
  );
};
