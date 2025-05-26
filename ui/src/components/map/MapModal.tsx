import { Dialog } from '@headlessui/react';
import { FC, useRef } from 'react';
import { useMapQueryParams } from '../../hooks';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { RouteEditorRef } from './refTypes';

type MapModalProps = {
  readonly className?: string;
};

const testIds = { mapModal: 'mapModal' };

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const MapModal: FC<MapModalProps> = ({ className = '' }) => {
  const mapRef = useRef<RouteEditorRef>(null);

  const { isMapOpen, deleteMapQueryParameters } = useMapQueryParams();

  const onCloseMapModal = () => {
    deleteMapQueryParameters();
  };

  return (
    <Dialog
      open={isMapOpen}
      onClose={onCloseMapModal}
      data-testid={testIds.mapModal}
      className={`absolute left-0 top-0 z-10 h-full w-full bg-background ${className}`}
    >
      <MapHeader onClose={onCloseMapModal} />
      {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
      <Map
        height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={() => mapRef.current?.onDrawRoute()}
        onEditRoute={() => mapRef.current?.onEditRoute()}
        onDeleteRoute={() => mapRef.current?.onDeleteRoute()}
        onCancel={() => mapRef.current?.onCancel()}
        onSave={() => mapRef.current?.onSave()}
      />
    </Dialog>
  );
};
