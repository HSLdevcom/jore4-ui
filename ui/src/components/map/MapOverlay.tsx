import React from 'react';
import { Column, Row } from '../../layoutComponents';

interface MapOverlayProps {
  className?: string;
}

export const MapOverlay: React.FC<MapOverlayProps> = ({
  className = '',
  children,
}) => {
  return (
    <Column className={`w-72 rounded bg-white shadow-md ${className}`}>
      {children}
    </Column>
  );
};

interface MapOverlayHeaderProps {
  className?: string;
  testId?: string;
}

export const MapOverlayHeader: React.FC<MapOverlayHeaderProps> = ({
  className = '',
  children,
  testId,
}) => {
  return (
    <Row
      className={`items-center space-x-1 border-b border-gray-200 bg-background p-3 ${className}`}
      testId={testId}
    >
      {children}
    </Row>
  );
};
