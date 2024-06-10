import { MapLayerMouseEvent } from 'maplibre-gl';

export interface RouteEditorRef {
  onDrawRoute: () => void;
  onEditRoute: () => void;
  onDeleteRoute: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export interface EditorLayerRef {
  onDelete: () => void;
}

export interface EditStoplayerRef {
  onMoveStop: (e: MapLayerMouseEvent) => Promise<void>;
}
export interface StopsRef {
  onMoveStop: (e: MapLayerMouseEvent) => Promise<void>;
  onCreateStop: (e: MapLayerMouseEvent) => Promise<void>;
}
