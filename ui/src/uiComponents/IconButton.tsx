import {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  isValidElement,
} from 'react';
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
  readonly onClick?: () => void;
};

const iconClassName = 'inline text-center';

export const IconButtonImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  IconButtonProps
> = (
  {
    testId,
    tooltip,
    className,
    disabled,
    icon,
    ariaAttributes,
    identifier,
    onClick,
  },
  ref,
) => {
  return (
    <button
      ref={ref}
      id={identifier}
      data-testid={testId}
      title={tooltip}
      className={twMerge(
        'cursor-pointer text-center disabled:cursor-default',
        className,
      )}
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
export const IconButton = forwardRef(IconButtonImpl);
