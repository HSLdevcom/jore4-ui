import React, { useRef, useState } from 'react';
import { MapEditorContext } from '../../context/MapEditorContext';
import { Modal } from '../../uiComponents';
import { Mode } from './DrawRouteLayer';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 104;
const mapFooterHeight = 128;

export const ModalMap: React.FC<Props> = ({ isOpen, onClose, className }) => {
  const mapRef = useRef<ExplicitAny>(null);
  const [drawingMode, setDrawingMode] = useState<Mode | undefined>(undefined);
  const [hasRoute, setHasRoute] = useState(false);
  const [canAddStops, setCanAddStops] = useState(false);

  const onDrawRoute = () => {
    setDrawingMode(drawingMode !== Mode.Draw ? Mode.Draw : undefined);
  };
  const onEditRoute = () => {
    setDrawingMode(drawingMode !== Mode.Edit ? Mode.Edit : undefined);
  };
  const onDeleteRoute = () => {
    setDrawingMode(undefined);
    mapRef?.current?.onDeleteDrawnRoute();
  };
  const onAddStop = () => {
    setDrawingMode(undefined);
    setCanAddStops(!canAddStops);
  };

  return (
    <MapEditorContext.Provider value={{ hasRoute, setHasRoute }}>
      <Modal isOpen={isOpen} onClose={onClose} className={className}>
        <MapHeader onClose={onClose} />
        {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
        <Map
          height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
          drawingMode={drawingMode}
          canAddStops={canAddStops}
          drawable
          ref={mapRef}
        />
        <MapFooter
          drawingMode={drawingMode}
          onDrawRoute={onDrawRoute}
          onEditRoute={onEditRoute}
          onDeleteRoute={onDeleteRoute}
          canAddStops={canAddStops}
          onAddStop={onAddStop}
        />
      </Modal>
    </MapEditorContext.Provider>
  );
};
