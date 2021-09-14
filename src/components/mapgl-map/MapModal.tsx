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
      {/* Setting height of map component dynamically seems to be tricky.
      Current 90vh is close enough in most cases, but in small screens map
      gets clipped by MapHeader and in big screens it might leave empyty space
      below the map. */}
      <Map height="90vh" />
    </Modal>
  );
};
