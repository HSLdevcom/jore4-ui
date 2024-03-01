import React from 'react';
import { InputElement } from './InputElement';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

interface Props {
  label: string;
  onClick: () => void;
  tooltip?: string;
  id: string;
  fieldPath: string;
  value: string;
  testId: string;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const LabeledRadioButton = ({
  label,
  onClick,
  tooltip,
  id,
  fieldPath,
  value,
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
      tooltip={tooltip}
      className={className}
      disabledTooltip={disabledTooltip}
      selected={selected}
      disabled={disabled}
    >
      <InputElement
        id={id}
        name={fieldPath}
        fieldPath={fieldPath}
        type="radio"
        value={value}
        tabIndex={-1} // Focus the button instead.
        testId={testId}
        className={`appearance-none rounded-full before:h-[14px] before:w-[14px] before:rounded-full before:bg-tweaked-brand
          ${
            selected
              ? labeledContainerInputStyles.selected
              : labeledContainerInputStyles.unselected
          }`}
        onChange={onClick}
        checked={selected}
        disabled={disabled}
      />
    </LabeledContainer>
  );
};
