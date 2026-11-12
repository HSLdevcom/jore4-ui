import { FC, PropsWithChildren } from 'react';
import { twJoin } from 'tailwind-merge';
import { Column, Row } from '../common/LayoutComponents';

type MapOverlayProps = {
  readonly className?: string;
  readonly testId?: string;
};

export const MapOverlay: FC<PropsWithChildren<MapOverlayProps>> = ({
  className,
  children,
  testId,
}) => {
  return (
    <Column
      className={twJoin('w-72 rounded-sm bg-white shadow-md', className)}
      testId={testId}
    >
      {children}
    </Column>
  );
};

type MapOverlayHeaderProps = {
  className?: string;
  testId?: string;
};

export const MapOverlayHeader: FC<PropsWithChildren<MapOverlayHeaderProps>> = ({
  className,
  children,
  testId,
}) => {
  return (
    <Row
      className={twJoin(
        'flex items-start justify-between gap-1 border-b border-gray-200 bg-background p-3',
        className,
      )}
      testId={testId}
    >
      {children}
    </Row>
  );
};
