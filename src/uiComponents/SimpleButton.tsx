import React, { ReactNode } from 'react';

interface CommonButtonProps {
  className?: string;
  inverted?: boolean;
  disabled?: boolean;
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
  const { className, inverted, disabled, children } = props;
  const colorClassNames = inverted
    ? 'text-brand bg-white border border-grey hover:border-brand active:border-brand'
    : 'text-white bg-brand border border-brand hover:bg-opacity-50 active:bg-opacity-50';
  const disabledClassNames = disabled ? 'pointer-events-none opacity-70' : '';
  const commonClassNames = `px-4 py-2 font-bold rounded-full ${colorClassNames} ${disabledClassNames}`;
  if ((props as ButtonProps).onClick) {
    return (
      <button
        className={`${commonClassNames} ${className}`}
        type="button"
        onClick={(props as ButtonProps).onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
  if ((props as LinkButtonProps).href) {
    // Try to take accessibility of disabled link buttons into account as stated
    // in Bootstrap's documentation:
    // https://getbootstrap.com/docs/5.1/components/buttons/#link-functionality-caveat
    return (
      <a
        className={`${commonClassNames} flex items-center ${className}`}
        type="button"
        href={disabled ? (props as LinkButtonProps).href : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </a>
    );
  }
  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
