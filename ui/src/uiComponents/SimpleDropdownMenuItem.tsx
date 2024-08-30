import React, { ForwardRefRenderFunction } from 'react';

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  testId: string;
  className?: string;
}

const SimpleDropdownMenuItemComponent: ForwardRefRenderFunction<
  HTMLButtonElement,
  Props
> = ({ text, onClick, disabled, testId, className }, ref) => {
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
    >
      {text}
    </button>
  );
};

export const SimpleDropdownMenuItem = React.forwardRef(
  SimpleDropdownMenuItemComponent,
);
