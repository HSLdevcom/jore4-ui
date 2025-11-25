import { MapLayerMouseEvent } from 'maplibre-gl';

export type RouteEditorRef = {
  readonly onDrawRoute: () => void;
  readonly onEditRoute: () => void;
  readonly onDeleteRoute: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

export type EditorLayerRef = {
  readonly onDelete: () => void;
};

export type EditStoplayerRef = {
  readonly onMoveStop: (e: MapLayerMouseEvent) => Promise<void>;
};
export type StopsRef = {
  readonly onMoveStop: (e: MapLayerMouseEvent) => Promise<void>;
  readonly onCreateStop: (e: MapLayerMouseEvent) => Promise<void>;
  readonly onCopyStop: (e: MapLayerMouseEvent) => Promise<void>;
};

export type EditStopAreaLayerRef = {
  readonly onMoveStopArea: (e: MapLayerMouseEvent) => Promise<void>;
};
export type StopAreasRef = {
  readonly onCreateStopArea: (e: MapLayerMouseEvent) => Promise<void>;
  readonly onMoveStopArea: (e: MapLayerMouseEvent) => Promise<void>;
};

export type EditTerminalLayerRef = {
  readonly onMoveTerminal: (e: MapLayerMouseEvent) => Promise<void>;
};
export type TerminalsRef = {
  readonly onCreateTerminal: (e: MapLayerMouseEvent) => Promise<void>;
  readonly onMoveTerminal: (e: MapLayerMouseEvent) => Promise<void>;
};
