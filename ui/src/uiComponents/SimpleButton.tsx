/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactNode } from 'react';
import { Link, To } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type CommonButtonProps = {
  readonly id?: string;
  readonly className?: string;
  readonly testId?: string;
  readonly inverted?: boolean;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly children?: ReactNode;
  readonly containerClassName?: string;
  readonly invertedClassName?: string;
  readonly tooltip?: string;
  readonly disabledTooltip?: string;
  readonly ariaSelected?: boolean;
  readonly role?: string;
  readonly ariaControls?: string;
};

type ButtonProps = {
  readonly onClick?: () => void;
  readonly type?: 'button' | 'reset' | 'submit' | undefined;
  readonly href?: never;
  readonly state?: never;
};

type LinkButtonProps = {
  readonly onClick?: never;
  readonly type?: never;
  readonly href: To;
  readonly state?: unknown;
};

export type SimpleButtonProps = CommonButtonProps &
  (ButtonProps | LinkButtonProps);

export const commonHoverStyle = 'hover:border-2 hover:border-tweaked-brand';

const getHoverStyles = (inverted = false, disabled = false) => {
  const hoverStyle = `${commonHoverStyle} m-px hover:m-0`;

  if (disabled) {
    return '';
  }

  return inverted
    ? `${hoverStyle} hover:border-brand`
    : `${hoverStyle} hover:bg-opacity-50`;
};

export const SimpleButton: FC<SimpleButtonProps> = ({
  id,
  className = '',
  inverted,
  selected,
  disabled,
  testId,
  children,
  containerClassName = '',
  invertedClassName = '',
  tooltip,
  disabledTooltip,
  ariaSelected,
  role,
  ariaControls,
  type = 'button',
  onClick,
  href,
  state,
}) => {
  const colorClassNames = inverted
    ? `text-brand bg-white border border-grey active:border-brand ${invertedClassName}`
    : `text-white bg-brand border border-brand active:bg-opacity-50`;
  const disabledClassNames = disabled
    ? 'cursor-not-allowed opacity-70 text-white bg-light-grey border-light-grey'
    : '';
  const commonClassNames = `px-4 py-2 font-bold rounded-full ${colorClassNames} ${getHoverStyles(
    inverted,
    disabled,
  )} ${disabledClassNames}`;

  if (href) {
    // Try to take accessibility of disabled link buttons into account as stated
    // in Bootstrap's documentation:
    // https://getbootstrap.com/docs/5.1/components/buttons/#link-functionality-caveat
    // "Disabled buttons using <a> should not include the href attribute."
    return (
      <span className={`inline-flex ${containerClassName}`}>
        <Link
          id={id}
          className={twMerge(
            `${commonClassNames} flex items-center ${className}`,
          )}
          type="button"
          // @ts-expect-error we want to pass undefined as href for disabled buttons
          to={disabled ? undefined : href}
          state={state}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          data-testid={testId}
          title={disabled ? disabledTooltip : tooltip}
        >
          {children}
        </Link>
      </span>
    );
  }

  if (
    (type === 'button' && onClick !== undefined) ||
    type === 'submit' ||
    type === 'reset'
  ) {
    return (
      <span className={`inline-flex ${containerClassName}`}>
        <button
          id={id}
          data-selected={selected}
          className={twMerge(`${commonClassNames} ${className}`)}
          // eslint-disable-next-line react/button-has-type
          type={type}
          onClick={onClick}
          disabled={disabled}
          data-testid={testId}
          title={disabled ? disabledTooltip : tooltip}
          aria-selected={ariaSelected}
          role={role}
          aria-controls={ariaControls}
        >
          {children}
        </button>
      </span>
    );
  }

  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
