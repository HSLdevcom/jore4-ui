import React from 'react';
import { SimpleButton } from '../../../uiComponents';

interface Props {
  label: string;
  onClick: () => void;
  tooltip?: string;
  id?: string;
  testId?: string;
  className?: string;
  containerClassName?: string;
  selected?: boolean;
  selectedClassName?: string;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const LabeledCheckbox = ({
  label,
  onClick,
  tooltip,
  id,
  testId,
  className,
  containerClassName,
  selected,
  selectedClassName,
  disabled,
  disabledTooltip,
}: Props): JSX.Element => {
  return (
    <SimpleButton
      id={id}
      testId={testId}
      className={className}
      containerClassName={containerClassName}
      onClick={onClick}
      tooltip={tooltip}
      selected={selected}
      inverted={!selected}
      invertedClassName={selectedClassName}
      disabled={disabled}
      disabledTooltip={disabledTooltip}
    >
      {label}
    </SimpleButton>
  );
};
