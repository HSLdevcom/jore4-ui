import React, { ReactNode } from 'react';

interface CommonButtonProps {
  className?: string;
  inverted?: boolean;
  children?: ReactNode;
}

interface ButtonProps {
  onClick: () => void;
  href?: never;
}
interface LinkButtonProps {
  onClick?: never;
  href: string;
}

type Props = CommonButtonProps & (ButtonProps | LinkButtonProps);

export const SimpleButton: React.FC<Props> = (props) => {
  const { className, inverted, children } = props;
  const colorClassNames = inverted
    ? 'text-blue-500 hover:bg-gray-100 bg-white'
    : 'text-white  bg-blue-500 hover:bg-blue-700';
  const commonClassNames = `px-4 py-2 font-bold rounded-full ${colorClassNames}`;
  if ((props as ButtonProps).onClick) {
    return (
      <button
        className={`${commonClassNames} ${className}`}
        type="button"
        onClick={(props as ButtonProps).onClick}
      >
        {children}
      </button>
    );
  }
  if ((props as LinkButtonProps).href) {
    return (
      <a
        className={`${commonClassNames} flex items-center ${className}`}
        type="button"
        href={(props as LinkButtonProps).href}
      >
        {children}
      </a>
    );
  }
  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
