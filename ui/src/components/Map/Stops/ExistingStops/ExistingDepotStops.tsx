import { FC } from 'react';
import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import {
  FilterType,
  MapEntityEditorViewState,
  selectMapFilter,
  selectSelectedDepotStopId,
  setSelectedDepotStopIdAction,
  useAppAction,
  useAppSelector,
} from '../../../../redux';
import { MapDepotStop } from '../../Types';
import { useMapViewState } from '../../Utils/useMapViewState';
import { Stop } from './Stop';

const testIds = {
  marker: (depotStop: MapDepotStop) =>
    `Map::DepotStops::marker::${depotStop.label}`,
};

type ExistingDepotStopsProps = {
  readonly depotStops: ReadonlyArray<MapDepotStop>;
};

export const ExistingDepotStops: FC<ExistingDepotStopsProps> = ({
  depotStops,
}) => {
  const [mapViewState, setMapViewState] = useMapViewState();
  const { stopFilters } = useAppSelector(selectMapFilter);
  const selectedDepotStopId = useAppSelector(selectSelectedDepotStopId);
  const setSelectedDepotStopId = useAppAction(setSelectedDepotStopIdAction);

  if (!stopFilters[FilterType.ShowAllTramStops]) {
    return null;
  }

  const onClickDepotStop = (depotStop: MapDepotStop) => {
    setSelectedDepotStopId(depotStop.id);
    setMapViewState({ depotStops: MapEntityEditorViewState.POPUP });
  };

  return (
    <>
      {depotStops.map((depotStop) => (
        <Stop
          key={depotStop.id}
          testId={testIds.marker(depotStop)}
          longitude={depotStop.location.coordinates[0]}
          latitude={depotStop.location.coordinates[1]}
          mapStopViewState={mapViewState.depotStops}
          selected={depotStop.id === selectedDepotStopId}
          activeTransportModes={[StopRegistryTransportModeType.Tram]}
          shouldBeGray
          depotStopLabel={depotStop.label}
          onDepotStopClick={() => onClickDepotStop(depotStop)}
        />
      ))}
    </>
  );
};
