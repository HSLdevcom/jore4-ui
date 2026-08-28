import { FC, useMemo } from 'react';
import {
  MapEntityEditorViewState,
  MapEntityType,
  isEditorOpen,
  selectMapStopSelection,
  selectSelectedStopAreaId,
  selectSelectedStopId,
  selectSelectedTerminalId,
  selectShowMapEntityTypes,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  useAppAction,
  useAppSelector,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import { mapLngLatToPoint, none } from '../../../../utils';
import { useResolveStopHoverTitle } from '../../Queries';
import { MapStop, MapStopArea, MapTerminal } from '../../Types';
import { useIsInSearchResultMode } from '../../Utils/useIsInSearchResultMode';
import { useMapViewState } from '../../Utils/useMapViewState';
import { Stop } from './Stop';
import { useFilterStopsByVehicleMode } from './useFilterStopsByVehicleMode';
import { useMapStops } from './useMapStops';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
  memberStop: (label: string) => `Map::Stops::memberStop::${label}`,
};

function useFilteredStops(
  stops: ReadonlyArray<MapStop>,
  terminals: ReadonlyArray<MapTerminal>,
  selectedStopAreaId: string | undefined | null,
  selectedTerminalId: string | undefined | null,
): ReadonlyArray<MapStop> {
  return useMemo(() => {
    if (selectedStopAreaId) {
      return stops.filter(
        (it) => it.stop_place_netex_id === selectedStopAreaId,
      );
    }

    if (selectedTerminalId) {
      const childAreaIds = terminals
        .find((it) => it.netex_id === selectedTerminalId)
        ?.children.map((it) => it.netexId);

      if (!childAreaIds?.length) {
        return [];
      }

      return stops.filter((it) =>
        childAreaIds.includes(it.stop_place_netex_id),
      );
    }

    return stops;
  }, [selectedStopAreaId, selectedTerminalId, stops, terminals]);
}

type ExistingStopsProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly showRoute: boolean;
  readonly stops: ReadonlyArray<MapStop>;
  readonly terminals: ReadonlyArray<MapTerminal>;
};

export const ExistingStops: FC<ExistingStopsProps> = ({
  areas,
  displayedRouteIds,
  showRoute,
  stops,
  terminals,
}) => {
  const [mapViewState, setMapViewState] = useMapViewState();

  const isInSearchResultMode = useIsInSearchResultMode();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);
  const mapStopSelection = useAppSelector(selectMapStopSelection);
  const showStopLabels = useAppSelector(selectShowMapEntityTypes)[
    MapEntityType.StopLabel
  ];

  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);

  const { getStopHighlighted, getStopShouldBeGray } =
    useMapStops(displayedRouteIds);
  const filterStopsByVehicleMode = useFilterStopsByVehicleMode(showRoute);

  const resolveStopHoverTitle = useResolveStopHoverTitle(areas);
  const onClickStop = (stop: MapStop) => {
    if (none(isEditorOpen, mapViewState)) {
      setSelectedStopId(stop.netex_id);
      setSelectedMapStopAreaId(stop.stop_place_netex_id);
      setMapViewState({
        stops: MapEntityEditorViewState.POPUP,
        stopAreas: MapEntityEditorViewState.NONE,
        terminals: MapEntityEditorViewState.NONE,
      });
    }
  };

  const filteredStops = useFilteredStops(
    stops,
    terminals,
    selectedStopAreaId,
    selectedTerminalId,
  );

  const asMemberStop = !!(selectedStopAreaId ?? selectedTerminalId);

  const selectedStops = mapStopSelection.byResultSelection
    ? []
    : mapStopSelection.selected;

  const isInSelection = (stop: MapStop) =>
    (isInSearchResultMode && mapStopSelection.byResultSelection) ||
    selectedStops.includes(stop.netex_id);

  const modeFilteredStops = filterStopsByVehicleMode(filteredStops);

  return modeFilteredStops.map((item) => {
    const point = mapLngLatToPoint(item.location.coordinates);

    return (
      <Stop
        isHighlighted={getStopHighlighted(item)}
        inSelection={isInSelection(item)}
        asMemberStop={asMemberStop}
        key={item.netex_id}
        latitude={point.latitude}
        longitude={point.longitude}
        mapStopViewState={mapViewState.stops}
        onClick={onClickStop}
        onResolveTitle={resolveStopHoverTitle}
        showLabel={showStopLabels}
        stop={item}
        selected={item.netex_id === selectedStopId}
        testId={
          asMemberStop
            ? testIds.memberStop(item.label)
            : testIds.stopMarker(item.label, item.priority)
        }
        activeTransportModes={item.active_transport_modes}
        isTrunkLineStop={item.trunk_line_stop}
        isSpeedTramStop={item.speed_tram_stop}
        shouldBeGray={getStopShouldBeGray(item)}
      />
    );
  });
};
