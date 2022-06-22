import React from 'react';
import { addClassName } from '../utils/components';

interface Props {
  testId?: string;
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

export const IconButton: React.FC<Props> = ({
  testId,
  className,
  disabled,
  icon,
  onClick,
}) => {
  const iconClassName = 'inline text-center';
  return (
    <button
      data-testid={testId}
      className={`text-center ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {React.isValidElement(icon) ? addClassName(icon, iconClassName) : icon}
    </button>
  );
};
