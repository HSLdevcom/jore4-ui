import React from 'react';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

interface Props {
  label: string;
  onClick: () => void;
  id: string;
  fieldPath: string;
  value: string | number;
  testId: string;
  className?: string;
  tooltip?: string;
  selected?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const LabeledRadioButton = ({
  label,
  onClick,
  id,
  fieldPath,
  value,
  testId,
  className = '',
  tooltip,
  selected,
  disabled,
  disabledTooltip,
}: Props): JSX.Element => {
  return (
    <LabeledContainer
      onClick={onClick}
      label={label}
      role="radio"
      tooltip={tooltip}
      className={className}
      disabledTooltip={disabledTooltip}
      selected={selected}
      disabled={disabled}
    >
      <input
        id={id}
        name={fieldPath}
        type="radio"
        value={value}
        tabIndex={-1} // Focus the button instead.
        data-testid={testId}
        className={`appearance-none rounded-full before:h-[14px] before:w-[14px] before:rounded-full before:bg-tweaked-brand
          ${
            selected
              ? labeledContainerInputStyles.selected
              : labeledContainerInputStyles.unselected
          }`}
        onChange={onClick}
        checked={selected}
        disabled={disabled}
        aria-hidden="true"
      />
    </LabeledContainer>
  );
};
