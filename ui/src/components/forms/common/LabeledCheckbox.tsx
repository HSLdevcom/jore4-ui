import React from 'react';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

interface Props {
  label: string;
  onClick: () => void;
  className?: string;
  tooltip?: string;
  id?: string;
  testId?: string;
  selected?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  hasError?: boolean;
}

export const LabeledCheckbox = ({
  label,
  onClick,
  className = '',
  tooltip,
  id,
  testId,
  selected,
  disabled,
  disabledTooltip,
  hasError,
}: Props): React.ReactElement => {
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
      hasError={hasError}
    >
      <input
        id={id}
        tabIndex={-1} // Focus the button instead.
        data-testid={testId}
        className={`icon-check appearance-none text-[18px] ${
          selected
            ? labeledContainerInputStyles.selected
            : labeledContainerInputStyles.unselected
        } `}
        type="checkbox"
        onChange={onClick}
        checked={selected}
        disabled={disabled}
        aria-hidden="true"
      />
    </LabeledContainer>
  );
};
