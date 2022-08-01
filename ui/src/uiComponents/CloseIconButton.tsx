import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
  testId?: string;
  label?: string;
}

export const CloseIconButton = ({
  onClick,
  className = '',
  testId,
  label,
}: Props): JSX.Element => {
  return (
    <button
      data-testid={testId}
      className={className}
      type="button"
      onClick={onClick}
    >
      {label}
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
