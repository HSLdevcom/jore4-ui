import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { theme } from '../generated/theme';

interface Props {
  visible: boolean;
  testId?: string;
}

export const LoadingOverlay: React.FC<Props> = ({ visible, testId = '' }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed top-1/2 left-1/2 z-50 h-32 -translate-y-1/2 -translate-x-1/2 cursor-wait border border-light-grey bg-background px-20 shadow-lg"
      data-testid={testId}
    >
      <PulseLoader
        color={theme.colors.brand}
        size={25}
        cssOverride={{ margin: 'auto auto' }}
        speedMultiplier={0.7}
      />
    </div>
  );
};
