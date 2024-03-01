import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
  tooltip?: string;
  id?: string;
  testId?: string;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const LabeledCheckbox = ({
  label,
  onClick,
  tooltip,
  id,
  testId,
  className = '',
  selected,
  disabled,
  disabledTooltip,
}: Props): JSX.Element => {
  const getStyleIfEnabled = (style: string) => (disabled ? '' : style);
  const colorsSelected = 'text-white';
  const colorsInverted = 'text-tweaked-brand bg-white';
  const borderSelected = `border-tweaked-brand ${getStyleIfEnabled(
    'hover:border-tweaked-brand-darker30',
  )}`;
  const borderInverted = 'border-grey';

  const styles = {
    labelSelected: `${colorsSelected} ${borderSelected} border-2 py-[5px] pl-[5px] pr-[12px] bg-tweaked-brand`,
    labelUnselected: `${colorsInverted} ${borderInverted} border py-[6px] pl-[6px] pr-[13px]
      ${getStyleIfEnabled(
        'hover:border-2 hover:py-[5px] hover:pl-[5px] hover:pr-[12px] hover:border-tweaked-brand',
      )}`, // Hover border is thicker, so paddings need to be reduced to maintain size...
    inputSelected: `${colorsInverted} ${borderSelected}`,
    inputUnselected: `${colorsSelected} ${borderInverted} before:opacity-0 ${getStyleIfEnabled(
      'group-hover:bg-background group-hover:border-grey',
    )}`,
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
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-black
        disabled:cursor-not-allowed disabled:opacity-70
        ${selected ? styles.labelSelected : styles.labelUnselected}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledTooltip : tooltip}
    >
      <input
        id={id}
        tabIndex={-1} // Focus the button instead.
        data-testid={testId}
        className={
          ' h-6 w-6 border p-0 text-[18px]' +
          ' icon-check flex items-center justify-center' +
          ' appearance-none' + // Unset global styles.
          ' focus-visible:outline-none' + // Disable the outline at least on Chrome, eg. when tabbing.
          ` ${selected ? styles.inputSelected : styles.inputUnselected}`
        }
        type="checkbox"
        onChange={onClick}
        checked={selected}
        disabled={disabled}
      />
      <span>{label}</span>
    </button>
  );
};
