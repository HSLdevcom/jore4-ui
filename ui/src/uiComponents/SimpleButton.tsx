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

/**
 * Normal: Big rounded pill shaped button
 * Slim: Slim pill shaped button with reduced padding
 * Square: Unrounded rectangular-ish button, with normalish padding
 * compact: Unrounded rectangular-ish button, with minimal padding
 * round: Circular button for a single icon
 */
type SimpleButtonShape = 'normal' | 'slim' | 'square' | 'compact' | 'round';

function getShapeClassNames(shape: SimpleButtonShape) {
  switch (shape) {
    case 'square':
      return 'rounded-sm border text-sm font-light py-1 px-4';

    case 'compact':
      return 'rounded-sm border text-sm font-light py-0 px-4';

    case 'slim':
      return 'px-4 py-1 font-bold border rounded-full';

    case 'round':
      return 'font-bold border rounded-full aspect-square p-0';

    case 'normal':
    default:
      return 'px-4 py-2 font-bold border rounded-full';
  }
}

function getColorClassNames(inverted: boolean, shape: SimpleButtonShape) {
  if (inverted) {
    if (shape === 'compact' || shape === 'square') {
      return `text-gray-900 bg-white border-grey active:border-brand`;
    }

    return `text-brand bg-white border-grey active:border-brand`;
  }

  return `text-white bg-brand border-brand active:bg-brand/50`;
}

export function getHoverStyles(inverted: boolean, disabled: boolean) {
  if (disabled) {
    return '';
  }

  if (inverted) {
    return 'hover:outline-brand hover:border-brand';
  }

  return 'hover:outline-tweaked-brand hover:border-tweaked-brand hover:bg-brand/50';
}

function getCommonClassNames(
  inverted: boolean,
  disabled: boolean,
  shape: SimpleButtonShape,
) {
  return twJoin(
    'flex cursor-pointer items-center justify-center',
    getShapeClassNames(shape),
    getColorClassNames(inverted, shape),
    // We cannot use 'disabled:' specifier, because the underlying implementation could be
    // a HTMLAnchorElement link instead of an button, and thus does not have the
    // disabled attribute.
    disabled &&
      'cursor-not-allowed border-light-grey bg-light-grey text-white opacity-70',
    getHoverStyles(inverted, disabled),
  );
}

export function getSimpleButtonClassNames(
  inverted: boolean = false,
  disabled: boolean = false,
  shape: SimpleButtonShape = 'normal',
  className: string = '',
  invertedClassName: string = '',
): string {
  return twMerge(
    getCommonClassNames(inverted, disabled, shape),
    className,
    inverted ? invertedClassName : null,
  );
}

type SimpleButtonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly shape?: SimpleButtonShape;
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
    disabled,
    inverted,
    invertedClassName,
    shape,
    testId,
    type = 'button',
    ...buttonProps
  },
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return (
    <button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
      className={getSimpleButtonClassNames(
        inverted,
        disabled,
        shape,
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
  readonly shape?: SimpleButtonShape;
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
    disabled,
    inverted,
    invertedClassName,
    shape,
    testId,
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
      className={getSimpleButtonClassNames(
        inverted,
        disabled,
        shape,
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
  readonly shape?: SimpleButtonShape;
  readonly testId?: string;
  readonly inverted?: boolean;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly children?: ReactNode;
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
  shape,
  inverted,
  selected,
  disabled,
  testId,
  children,
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
      <SimpleLinkButton
        id={id}
        className={className}
        shape={shape}
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
    );
  }

  if (
    (type === 'button' && onClick !== undefined) ||
    type === 'submit' ||
    type === 'reset'
  ) {
    return (
      <SimpleButtonButton
        id={id}
        data-selected={selected}
        className={className}
        shape={shape}
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
    );
  }

  // eslint-disable-next-line no-console
  console.error('"onClick" or "href" prop is required');
  return null;
};
