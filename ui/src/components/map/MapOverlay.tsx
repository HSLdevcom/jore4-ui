import React, { FC, ReactNode } from 'react';
import { Column, Row } from '../../layoutComponents';

interface MapOverlayProps {
  className?: string;
  children: ReactNode;
}

export const MapOverlay: FC<MapOverlayProps> = ({
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
  children: ReactNode;
}

export const MapOverlayHeader: FC<MapOverlayHeaderProps> = ({
  className = '',
  children,
  testId,
}) => {
  return (
    <Row
      className={`space-x-1 border-b border-gray-200 bg-background p-3 ${className}`}
      testId={testId}
    >
      {children}
    </Row>
  );
};
