import React from 'react';
import { addClassName } from '../utils/components';

interface Props {
  testId?: string;
  tooltip: string;
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  ariaAttributes?: {
    ariaExpanded?: boolean;
    ariaControls?: string;
    ariaLabel?: string;
  };
  identifier?: string;
  onClick: () => void;
}

export const IconButton: React.FC<Props> = ({
  testId,
  tooltip,
  className = '',
  disabled,
  icon,
  ariaAttributes,
  identifier,
  onClick,
}) => {
  const iconClassName = 'inline text-center';
  return (
    <button
      id={identifier}
      data-testid={testId}
      title={tooltip}
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
