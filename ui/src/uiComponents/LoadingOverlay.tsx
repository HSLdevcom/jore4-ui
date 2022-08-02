import React from 'react';
import { Column } from '../layoutComponents';
import { LoadingIndicator } from './LoadingIndicator';

interface LoadingOverlayProps {
  testId?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ testId }) => {
  return (
    <Column
      className="center-in-view fixed z-50 cursor-wait"
      data-testid={testId}
    >
      <div className="flex h-32 border border-light-grey bg-background px-20 text-brand shadow-lg">
        <LoadingIndicator className="flex" />
      </div>
    </Column>
  );
};
