import { FC } from 'react';
import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { FilterType, selectMapFilter, useAppSelector } from '../../../../redux';
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
  const [mapViewState] = useMapViewState();
  const { stopFilters } = useAppSelector(selectMapFilter);

  if (!stopFilters[FilterType.ShowAllTramStops]) {
    return null;
  }

  return (
    <>
      {depotStops.map((depotStop) => (
        <Stop
          key={depotStop.id}
          testId={testIds.marker(depotStop)}
          longitude={depotStop.location.coordinates[0]}
          latitude={depotStop.location.coordinates[1]}
          mapStopViewState={mapViewState.depotStops}
          activeTransportModes={[StopRegistryTransportModeType.Tram]}
          shouldBeGray
          depotStopLabel={depotStop.label}
        />
      ))}
    </>
  );
};
