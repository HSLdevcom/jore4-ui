/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface CommonButtonProps {
  id?: string;
  className?: string;
  testId?: string;
  inverted?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  containerClassName?: string;
  invertedClassName?: string;
  tooltip?: string;
  disabledTooltip?: string;
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

const getHoverStyles = (inverted = false, disabled = false) => {
  const hoverStyle = `${commonHoverStyle} m-px hover:m-0`;

  if (disabled) {
    return '';
  }

  return inverted
    ? `${hoverStyle} hover:border-brand`
    : `${hoverStyle} hover:bg-opacity-50`;
};

export const SimpleButton: React.FC<Props> = (props) => {
  const {
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
  } = props;

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

  if ((props as ButtonProps).onClick) {
    return (
      <span className={`inline-flex ${containerClassName}`}>
        <button
          id={id}
          data-selected={selected}
          className={twMerge(`${commonClassNames} ${className}`)}
          type="button"
          onClick={(props as ButtonProps).onClick}
          disabled={disabled}
          data-testid={testId}
          title={disabled ? disabledTooltip : tooltip}
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
      <span className={`inline-flex ${containerClassName}`}>
        <Link
          id={id}
          className={twMerge(
            `${commonClassNames} flex items-center ${className}`,
          )}
          type="button"
          // @ts-expect-error we want to pass undefined as href for disabled buttons
          to={disabled ? undefined : (props as LinkButtonProps).href}
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
  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
