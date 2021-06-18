import React from 'react';

interface Props {
  className?: string;
  onClick: () => void;
}

export const SimpleButton: React.FC<Props> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={`px-4 py-2 text-white font-bold bg-blue-500 hover:bg-blue-700 rounded-full ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
