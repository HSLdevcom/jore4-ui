import React from 'react';
import { PulseLoader } from 'react-spinners';
import { theme } from '../generated/theme';
import { Column } from '../layoutComponents';

interface LoadingOverlayProps {
  testId?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ testId }) => {
  return (
    <Column
      className="fixed top-1/2 left-1/2 z-50 -translate-y-1/2 -translate-x-1/2 cursor-wait"
      data-testid={testId}
    >
      <div className="flex h-32 border border-light-grey bg-background px-20 shadow-lg">
        <PulseLoader
          color={theme.colors.brand}
          size={25}
          cssOverride={{ margin: 'auto auto' }}
          speedMultiplier={0.7}
        />
      </div>
    </Column>
  );
};
