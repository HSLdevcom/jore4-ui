import React, { Ref } from 'react';

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  testId: string;
  className?: string;
}

const SimpleDropdownMenuItemComponent = (
  { text, onClick, disabled, testId, className }: Props,
  externalRef: Ref<ExplicitAny>,
) => {
  return (
    <button
      ref={externalRef}
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
