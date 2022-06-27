import React, { useRef } from 'react';
import { useIsModalMapOpen } from '../../hooks';
import { Modal } from '../../uiComponents';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';

interface Props {
  className?: string;
}

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const ModalMap: React.FC<Props> = ({ className = '' }) => {
  const mapRef = useRef<ExplicitAny>(null);

  const { isModalMapOpen, onCloseModalMap } = useIsModalMapOpen();

  return (
    <Modal
      isOpen={isModalMapOpen}
      onClose={onCloseModalMap}
      className={`absolute left-0 top-0 z-10 h-full w-full !bg-background ${className}`}
    >
      <MapHeader onClose={onCloseModalMap} />
      {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
      <Map
        height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
        drawable
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={() => mapRef.current.onDrawRoute()}
        onEditRoute={() => mapRef.current.onEditRoute()}
        onDeleteRoute={() => mapRef.current.onDeleteRoute()}
        onCancel={() => mapRef.current.onCancel()}
        onSave={() => mapRef.current.onSave()}
      />
    </Modal>
  );
};
