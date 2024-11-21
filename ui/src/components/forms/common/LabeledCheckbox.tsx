import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

interface Props {
  label: string;
  onBlur?: React.FocusEventHandler<HTMLButtonElement> | undefined;
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

const LabeledCheckboxImpl: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  {
    label,
    onBlur,
    onClick,
    className = '',
    tooltip,
    id,
    testId,
    selected,
    disabled,
    disabledTooltip,
    hasError,
  },
  ref,
) => {
  return (
    <LabeledContainer
      onBlur={onBlur}
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
        ref={ref}
      />
    </LabeledContainer>
  );
};

export const LabeledCheckbox = forwardRef(LabeledCheckboxImpl);
