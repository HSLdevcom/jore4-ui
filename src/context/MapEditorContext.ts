/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import React from 'react';

export enum Mode {
  Draw,
  Edit,
}

interface IMapEditorContext {
  hasRoute: boolean;
  setHasRoute: (hasRoute: boolean) => void;
  lineId: string | undefined;
  setLineId: (lineId: string) => void;
  drawingMode: Mode | undefined;
  setDrawingMode: (mode: Mode | undefined) => void;
}

export const MapEditorContext = React.createContext<IMapEditorContext>({
  hasRoute: false,
  setHasRoute: (hasRoute: boolean) => {},
  lineId: undefined,
  setLineId: (lineId: string) => {},
  drawingMode: undefined,
  setDrawingMode: (mode: Mode | undefined) => {},
});
