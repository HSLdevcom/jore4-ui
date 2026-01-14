import { FC, useRef } from 'react';
import { useAppAction, useNavigateBackSafely } from '../../hooks';
import {
  MapEntityEditorViewState,
  setCopyStopIdAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  setSelectedTerminalIdAction,
} from '../../redux';
import { useWrapInContextNavigation } from '../forms/common/NavigationBlocker';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { MapLoader } from './MapLoader';
import { RouteEditorRef } from './refTypes';
import { ProvideMapUrlStateContext } from './utils/mapUrlState';
import { useMapViewState } from './utils/useMapViewState';

const testIds = { mapPage: 'mapPage' };

export const MapPage: FC = () => {
  const mapRef = useRef<RouteEditorRef>(null);
  const navigateBackSafely = useNavigateBackSafely();

  // For the map page we want to block navigation away for all dirty forms that may be open
  const wrapInContextNavigation = useWrapInContextNavigation('BlockForAll');

  const [, setMapViewState] = useMapViewState();
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setCopyStopId = useAppAction(setCopyStopIdAction);
  const setSelectedStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);

  const onCloseMap = wrapInContextNavigation(() => {
    // By setting the view states to NONE here on map close, we can prevent an error which
    // happens if the user has stop placement active and closes the map. The error
    // happens when the line from stop to infra link is being removed.
    setMapViewState({
      stops: MapEntityEditorViewState.NONE,
      stopAreas: MapEntityEditorViewState.NONE,
      terminals: MapEntityEditorViewState.NONE,
    });

    // Also reset any active selections on exit
    setSelectedStopId(undefined);
    setCopyStopId(undefined);
    setSelectedStopAreaId(undefined);
    setSelectedTerminalId(undefined);

    navigateBackSafely('/');
  });

  return (
    <ProvideMapUrlStateContext>
      <div
        data-testid={testIds.mapPage}
        className="flex h-screen w-screen flex-col bg-background"
      >
        <MapHeader onClose={onCloseMap} />

        <Map ref={mapRef} className="grow" />

        <MapFooter
          onDrawRoute={() => mapRef.current?.onDrawRoute()}
          onEditRoute={() => mapRef.current?.onEditRoute()}
          onDeleteRoute={() => mapRef.current?.onDeleteRoute()}
          onCancel={() => mapRef.current?.onCancel()}
          onSave={() => mapRef.current?.onSave()}
        />

        <MapLoader />
      </div>
    </ProvideMapUrlStateContext>
  );
};
