import { FC, FocusEventHandler, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type LabeledContainerProps = {
  readonly label: string;
  readonly onBlur?: FocusEventHandler<HTMLButtonElement> | undefined;
  readonly onClick: () => void;
  readonly role: string;
  readonly className?: string;
  readonly tooltip?: string;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly disabledTooltip?: string;
  readonly hasError?: boolean;
};

// Note: there is no error style defined for "selected" case. Couldn't think of a reasonable case where that would be needed.
const buttonErrorStyles =
  'has-error border-hsl-red text-hsl-red bg-white enabled:hover:border-hsl-red';
const inputErrorStyles =
  '[.has-error>&]:border-hsl-red [.has-error>&]:text-hsl-red [.has-error:hover>&]:enabled:border-hsl-red';

// Classes that should be set to the child input element according to the `selected` value.
// These _could_ be done with just CSS inside this container component,
// but that would bloat the class names a bit with prefixes.
const commonInputStyles = `flex h-6 w-6 items-center justify-center border p-0 disabled:cursor-not-allowed ${inputErrorStyles}`;
export const labeledContainerInputStyles = {
  selected: `${commonInputStyles} text-tweaked-brand bg-white border-tweaked-brand enabled:group-hover:border-tweaked-brand-darker30`,
  unselected: `${commonInputStyles} text-white border-grey before:opacity-0 enabled:group-hover:bg-background enabled:group-hover:border-grey`,
};

export const LabeledContainer: FC<PropsWithChildren<LabeledContainerProps>> = ({
  label,
  onBlur,
  onClick,
  role,
  className,
  tooltip,
  selected,
  disabled,
  disabledTooltip,
  hasError = false,
  children,
}) => {
  // When border is thicker, the paddings need to be reduced to maintain size...
  const containerThickBorders = 'border-2 py-[5px] pl-[5px] pr-[12px]';
  const containerThickBordersHover =
    'enabled:hover:border-2 enabled:hover:py-[5px] enabled:hover:pl-[5px] enabled:hover:pr-[12px]';
  const containerThinBorders = 'border py-[6px] pl-[6px] pr-[13px]';
  const styles = {
    containerSelected:
      'text-white border-tweaked-brand enabled:hover:border-tweaked-brand-darker30 bg-tweaked-brand',
    containerUnselected:
      'text-tweaked-brand bg-white border-grey enabled:hover:border-tweaked-brand',
  };

  const containerStyleSelectedStatus = selected
    ? styles.containerSelected
    : styles.containerUnselected;
  const containerStyleErrorStatus = hasError ? buttonErrorStyles : '';
  const containerBorderSizeStyles =
    selected && !hasError
      ? containerThickBorders
      : `${containerThinBorders} ${containerThickBordersHover}`;

  return (
    // Using button instead of label because button can have focus and label can't.
    // With label we would have to rely on the input's focus, and some styling wouldn't be possible,
    // eg. styling the label based on input:focus-visible.
    <button
      type="button"
      className={twMerge(
        'group inline-flex cursor-default select-none items-center gap-2 rounded-[5px] border-solid text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70',
        containerStyleSelectedStatus,
        containerStyleErrorStatus,
        containerBorderSizeStyles,
        className,
      )}
      onBlur={onBlur}
      onClick={onClick}
      role={role}
      aria-checked={selected}
      disabled={disabled}
      title={disabled ? disabledTooltip : tooltip}
    >
      {children}
      <span>{label}</span>
    </button>
  );
};
