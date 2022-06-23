import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
  label?: string;
}

export const CloseIconButton = ({
  onClick,
  className = '',
  label,
}: Props): JSX.Element => {
  return (
    <button className={className} type="button" onClick={onClick}>
      {label}
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
