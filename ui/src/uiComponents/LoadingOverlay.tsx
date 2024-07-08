import React, { useEffect, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { theme } from '../generated/theme';

interface Props {
  delay?: number;
  isLoading: boolean;
  testId?: string;
}

export const LoadingOverlay: React.FC<Props> = ({
  delay = 0,
  isLoading,
  testId = '',
}) => {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      return setVisible(false);
    }

    if (delay === 0) {
      return setVisible(true);
    }

    const setVisibleTimeout = setTimeout(() => setVisible(true), delay);
    return clearTimeout(setVisibleTimeout);
  }, [isLoading, delay]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed left-1/2 top-1/2 z-50 flex h-32 -translate-x-1/2 -translate-y-1/2 cursor-wait rounded border border-light-grey bg-background px-20 shadow-lg"
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
