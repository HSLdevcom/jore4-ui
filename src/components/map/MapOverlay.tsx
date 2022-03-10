import React from 'react';
import { Column, Row } from '../../layoutComponents';

interface MapOverlayProps {
  className?: string;
}

export const MapOverlay: React.FC<MapOverlayProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`inline-block w-72 ${className}`}>
      <Column className="bg-white shadow-md">{children}</Column>
    </div>
  );
};

interface MapOverlayHeaderProps {
  className?: string;
}

export const MapOverlayHeader: React.FC<MapOverlayHeaderProps> = ({
  className,
  children,
}) => {
  return (
    <Row
      className={`items-center space-x-1 border-b border-gray-200 bg-background p-3 ${className}`}
    >
      {children}
    </Row>
  );
};
