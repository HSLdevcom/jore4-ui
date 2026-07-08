import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
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
  className,
  tooltip,
  selected,
  disabled,
  disabledTooltip,
  hasError,
}) => {
  return (
    <LabeledContainer
      label={label}
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
        data-testid={testId}
        className={twMerge(
          'appearance-none rounded-full',
          'before:h-3.5 before:w-3.5 before:rounded-full before:bg-tweaked-brand',
          'focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-solid',
          '[.has-error>&]:before:bg-hsl-red',
          selected
            ? labeledContainerInputStyles.selected
            : labeledContainerInputStyles.unselected,
        )}
        onChange={onClick}
        checked={selected}
        disabled={disabled}
      />
    </LabeledContainer>
  );
};
