/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CommonButtonProps {
  id?: string;
  className?: string;
  testId?: string;
  inverted?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  containerClassName?: string;
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

export const commonHoverStyle = 'hover:border-2 hover:border-tweaked-brand';
const hoverStyle = `${commonHoverStyle} m-px hover:m-0`;

export const SimpleButton: React.FC<Props> = (props) => {
  const {
    id,
    className,
    inverted,
    disabled,
    testId,
    children,
    containerClassName,
  } = props;
  const colorClassNames = inverted
    ? `text-brand bg-white border border-grey hover:border-brand active:border-brand ${hoverStyle}`
    : `text-white bg-brand border border-brand hover:bg-opacity-50 active:bg-opacity-50 ${hoverStyle}`;
  const disabledClassNames = disabled ? 'pointer-events-none opacity-70' : '';
  const commonClassNames = `px-4 py-2 font-bold rounded-full ${colorClassNames} ${disabledClassNames}`;
  if ((props as ButtonProps).onClick) {
    return (
      <span className={containerClassName}>
        <button
          id={id}
          className={`${commonClassNames} ${className}`}
          type="button"
          onClick={(props as ButtonProps).onClick}
          disabled={disabled}
          data-testid={testId}
        >
          {children}
        </button>
      </span>
    );
  }
  if ((props as LinkButtonProps).href) {
    // Try to take accessibility of disabled link buttons into account as stated
    // in Bootstrap's documentation:
    // https://getbootstrap.com/docs/5.1/components/buttons/#link-functionality-caveat
    // "Disabled buttons using <a> should not include the href attribute."
    return (
      <span className={`flex ${containerClassName}`}>
        <Link
          id={id}
          className={`${commonClassNames} flex items-center ${className}`}
          type="button"
          // @ts-expect-error we want to pass undefined as href for disabled buttons
          to={disabled ? undefined : (props as LinkButtonProps).href}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          data-testid={testId}
        >
          {children}
        </Link>
      </span>
    );
  }
  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
