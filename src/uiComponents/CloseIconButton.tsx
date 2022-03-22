import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
}

export const CloseIconButton = ({ onClick, className }: Props): JSX.Element => {
  return (
    <button className={className || ''} type="button" onClick={onClick}>
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
