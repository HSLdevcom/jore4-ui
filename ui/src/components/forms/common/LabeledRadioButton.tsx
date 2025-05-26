import { FC } from 'react';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

type LabeledRadioButtonProps = {
  readonly label: string;
  readonly onClick: () => void;
  readonly id: string;
  readonly fieldPath: string;
  readonly value: string | number;
  readonly testId: string;
  readonly className?: string;
  readonly tooltip?: string;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly disabledTooltip?: string;
  readonly hasError?: boolean;
};

export const LabeledRadioButton: FC<LabeledRadioButtonProps> = ({
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
  hasError,
}) => {
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
      hasError={hasError}
    >
      <input
        id={id}
        name={fieldPath}
        type="radio"
        value={value}
        tabIndex={-1} // Focus the button instead.
        data-testid={testId}
        className={`appearance-none rounded-full before:h-[14px] before:w-[14px] before:rounded-full before:bg-tweaked-brand [.has-error>&]:before:bg-hsl-red ${
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
