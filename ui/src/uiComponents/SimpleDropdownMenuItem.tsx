import { ForwardRefRenderFunction, forwardRef } from 'react';

type SimpleDropdownMenuItemProps = {
  readonly text: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly testId: string;
  readonly className?: string;
  readonly title?: string;
};

const SimpleDropdownMenuItemComponent: ForwardRefRenderFunction<
  HTMLButtonElement,
  SimpleDropdownMenuItemProps
> = ({ text, onClick, disabled, testId, className, title }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${className} ${
        disabled ? 'bg-background text-dark-grey' : ''
      }`}
      type="button"
      onClick={onClick}
      data-testid={testId}
      title={title}
    >
      {text}
    </button>
  );
};

export const SimpleDropdownMenuItem = forwardRef(
  SimpleDropdownMenuItemComponent,
);
