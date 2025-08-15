import {
  ButtonHTMLAttributes,
  FC,
  ForwardRefRenderFunction,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from 'react';
import { Link, LinkProps, To } from 'react-router';
import { twJoin, twMerge } from 'tailwind-merge';

export function getHoverStyles(inverted?: boolean, disabled?: boolean) {
  if (disabled) {
    return '';
  }

  return twJoin(
    'hover:outline hover:outline-1',
    inverted
      ? 'hover:outline-brand hover:border-brand'
      : 'hover:outline-tweaked-brand hover:border-tweaked-brand hover:bg-opacity-50',
  );
}

function getCommonClassNames(inverted?: boolean, disabled?: boolean) {
  const colorClassNames = inverted
    ? 'text-brand bg-white border-grey active:border-brand'
    : 'text-white bg-brand border-brand active:bg-opacity-50';

  const disabledClassNames = disabled
    ? 'cursor-not-allowed opacity-70 text-white bg-light-grey border-light-grey'
    : '';

  return twJoin(
    'px-4 py-2 font-bold border rounded-full',
    colorClassNames,
    disabledClassNames,
    getHoverStyles(inverted, disabled),
  );
}

function getClassNames(
  inverted?: boolean,
  disabled?: boolean,
  className?: string,
  invertedClassName?: string,
): string {
  return twMerge(
    getCommonClassNames(inverted, disabled),
    className,
    inverted ? invertedClassName : null,
  );
}

type SimpleButtonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly inverted?: boolean;
  readonly invertedClassName?: string;
  readonly testId?: string;
};

const SimpleButtonButtonImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  SimpleButtonButtonProps
> = (
  {
    className,
    inverted,
    disabled,
    testId,
    invertedClassName,
    type = 'button',
    ...buttonProps
  },
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return (
    <button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
      className={getClassNames(
        inverted,
        disabled,
        className,
        invertedClassName,
      )}
      data-testid={testId}
      disabled={disabled}
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type}
    />
  );
};
export const SimpleButtonButton = forwardRef(SimpleButtonButtonImpl);

type SimpleLinkButtonProps = LinkProps & {
  readonly disabled?: boolean;
  readonly inverted?: boolean;
  readonly invertedClassName?: string;
  readonly testId?: string;
};

export const SimpleLinkButtonImpl: ForwardRefRenderFunction<
  HTMLAnchorElement,
  SimpleLinkButtonProps
> = (
  {
    className,
    inverted,
    disabled,
    testId,
    invertedClassName,
    to,
    ...linkProps
  },
  ref,
) => {
  // Try to take accessibility of disabled link buttons into account as stated
  // in Bootstrap's documentation:
  // https://getbootstrap.com/docs/5.1/components/buttons/#link-functionality-caveat
  // "Disabled buttons using <a> should not include the href attribute."

  return (
    <Link
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...linkProps}
      className={getClassNames(
        inverted,
        disabled,
        className,
        invertedClassName,
      )}
      to={disabled ? {} : to}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      data-testid={testId}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
    />
  );
};
export const SimpleLinkButton = forwardRef(SimpleLinkButtonImpl);

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

export const SimpleButton: FC<SimpleButtonProps> = ({
  id,
  className,
  inverted,
  selected,
  disabled,
  testId,
  children,
  containerClassName = '',
  invertedClassName,
  tooltip,
  disabledTooltip,
  ariaSelected,
  role,
  ariaControls,
  type = 'button',
  onClick,
  href,
  state,
}: SimpleButtonProps) => {
  if (href) {
    return (
      <span className={`inline-flex ${containerClassName}`}>
        <SimpleLinkButton
          id={id}
          className={className}
          disabled={disabled}
          inverted={inverted}
          invertedClassName={invertedClassName}
          to={href}
          state={state}
          testId={testId}
          aria-label={disabled ? disabledTooltip : tooltip}
          title={disabled ? disabledTooltip : tooltip}
        >
          {children}
        </SimpleLinkButton>
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
        <SimpleButtonButton
          id={id}
          data-selected={selected}
          className={className}
          invertedClassName={invertedClassName}
          inverted={inverted}
          type={type}
          onClick={onClick}
          disabled={disabled}
          testId={testId}
          aria-label={disabled ? disabledTooltip : tooltip}
          title={disabled ? disabledTooltip : tooltip}
          aria-selected={ariaSelected}
          role={role}
          aria-controls={ariaControls}
        >
          {children}
        </SimpleButtonButton>
      </span>
    );
  }

  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
