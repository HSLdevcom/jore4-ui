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
      <Map />
    </Modal>
  );
};
