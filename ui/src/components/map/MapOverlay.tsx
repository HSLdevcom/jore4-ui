import { FC, PropsWithChildren } from 'react';
import { Column, Row } from '../../layoutComponents';

type MapOverlayProps = {
  readonly className?: string;
};

export const MapOverlay: FC<PropsWithChildren<MapOverlayProps>> = ({
  className = '',
  children,
}) => {
  return (
    <Column className={`w-72 rounded bg-white shadow-md ${className}`}>
      {children}
    </Column>
  );
};

type MapOverlayHeaderProps = {
  className?: string;
  testId?: string;
};

export const MapOverlayHeader: FC<PropsWithChildren<MapOverlayHeaderProps>> = ({
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
