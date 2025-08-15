import { FC, ReactNode, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { addClassName } from '../utils/components';

type IconButtonProps = {
  readonly testId?: string;
  readonly tooltip: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly icon: ReactNode;
  readonly ariaAttributes?: {
    readonly ariaExpanded?: boolean;
    readonly ariaControls?: string;
    readonly ariaLabel?: string;
  };
  readonly identifier?: string;
  readonly onClick: () => void;
};

const iconClassName = 'inline text-center';

export const IconButton: FC<IconButtonProps> = ({
  testId,
  tooltip,
  className,
  disabled,
  icon,
  ariaAttributes,
  identifier,
  onClick,
}) => {
  return (
    <button
      id={identifier}
      data-testid={testId}
      title={tooltip}
      className={twMerge('text-center', className)}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={ariaAttributes?.ariaExpanded}
      aria-controls={ariaAttributes?.ariaControls}
      aria-label={ariaAttributes?.ariaLabel}
    >
      {isValidElement(icon) ? addClassName(icon, iconClassName) : icon}
    </button>
  );
};
