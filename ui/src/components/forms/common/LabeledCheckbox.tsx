import React from 'react';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

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
  return (
    <LabeledContainer
      onClick={onClick}
      label={label}
      role="checkbox"
      tooltip={tooltip}
      className={className}
      disabledTooltip={disabledTooltip}
      selected={selected}
      disabled={disabled}
    >
      <input
        id={id}
        tabIndex={-1} // Focus the button instead.
        data-testid={testId}
        className={`icon-check appearance-none text-[18px]
           ${
             selected
               ? labeledContainerInputStyles.selected
               : labeledContainerInputStyles.unselected
           }
        `}
        type="checkbox"
        onChange={onClick}
        checked={selected}
        disabled={disabled}
        aria-hidden="true"
      />
    </LabeledContainer>
  );
};
