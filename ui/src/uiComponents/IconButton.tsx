import React, { FC } from 'react';
import { addClassName } from '../utils/components';

type IconButtonProps = {
  readonly testId?: string;
  readonly tooltip: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly icon: React.ReactNode;
  readonly ariaAttributes?: {
    readonly ariaExpanded?: boolean;
    readonly ariaControls?: string;
    readonly ariaLabel?: string;
  };
  readonly identifier?: string;
  readonly onClick: () => void;
};

export const IconButton: FC<IconButtonProps> = ({
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
