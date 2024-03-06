import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
  role: string;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
  disabledTooltip?: string;
}

// Classes that should be set to the child input element accordig to the `selected` value.
// These _could_ be done with just CSS inside this container component,
// but that would bloat the class names a bit with prefixes.
const commonInputStyles =
  'flex h-6 w-6 items-center justify-center border p-0 disabled:cursor-not-allowed';
export const labeledContainerInputStyles = {
  selected: `${commonInputStyles} text-tweaked-brand bg-white border-tweaked-brand enabled:group-hover:border-tweaked-brand-darker30`,
  unselected: `${commonInputStyles} text-white border-grey before:opacity-0 enabled:group-hover:bg-background enabled:group-hover:border-grey`,
};

export const LabeledContainer: React.FC<Props> = ({
  label,
  onClick,
  role,
  tooltip,
  className = '',
  selected,
  disabled,
  disabledTooltip,
  children,
}): JSX.Element => {
  const styles = {
    containerSelected: `text-white border-tweaked-brand enabled:hover:border-tweaked-brand-darker30 border-2 py-[5px] pl-[5px] pr-[12px] bg-tweaked-brand`,
    containerUnselected: `text-tweaked-brand bg-white border-grey border py-[6px] pl-[6px] pr-[13px]
        enabled:hover:border-2 enabled:hover:py-[5px] enabled:hover:pl-[5px] enabled:hover:pr-[12px] enabled:hover:border-tweaked-brand
      `, // Hover border is thicker, so paddings need to be reduced to maintain size...
  };

  return (
    // Using button instead of label because button can have focus and label can't.
    // With label we would have to rely on the input's focus, and some styling wouldn't be possible,
    // eg. styling the label based on input:focus-visible.
    <button
      type="button"
      className={`
        group inline-flex cursor-default select-none items-center gap-2 rounded-[5px] border-solid
        text-sm font-bold
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-black disabled:cursor-not-allowed
        disabled:opacity-70
        ${selected ? styles.containerSelected : styles.containerUnselected}
        ${className}
      `}
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
