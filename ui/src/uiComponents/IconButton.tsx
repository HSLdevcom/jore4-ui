import React from 'react';
import { addClassName } from '../utils/components';

interface Props {
  testId?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  ariaAttributes?: {
    ariaExpanded?: boolean;
    ariaControls?: string;
    ariaLabel?: string;
  };
  onClick: () => void;
}

export const IconButton: React.FC<Props> = ({
  testId,
  title,
  className = '',
  disabled,
  icon,
  ariaAttributes,
  onClick,
}) => {
  const iconClassName = 'inline text-center';
  return (
    <button
      data-testid={testId}
      title={title}
      className={`text-center ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={ariaAttributes?.ariaExpanded}
      aria-controls={ariaAttributes?.ariaControls}
      aria-label={ariaAttributes?.ariaLabel}
    >
      {React.isValidElement(icon) ? addClassName(icon, iconClassName) : icon}
    </button>
  );
};
