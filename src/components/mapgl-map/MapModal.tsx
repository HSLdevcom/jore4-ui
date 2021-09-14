import React from 'react';
import { Modal } from '../../uiComponents';
import { Map } from './Map';
import { MapHeader } from './MapHeader';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const MapModal: React.FC<Props> = ({ isOpen, onClose, className }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <MapHeader onClose={onClose} />
      {/* Setting height of map component dynamically seems to be tricky as
      it doesn't respect e.g. "height: 100%" rule.
      As a workaround we can use css's `calc` function and magically subtract
      height of Mapheader from full screen height. This is ugly, but seems to
      work perfectly - at least until someone changes height of MapHeader...
      */}
      <Map height="calc(100vh - 104px)" />
    </Modal>
  );
};
