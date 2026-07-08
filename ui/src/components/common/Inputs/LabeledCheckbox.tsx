import { FocusEventHandler, ForwardRefRenderFunction, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  LabeledContainer,
  labeledContainerInputStyles,
} from './LabeledContainer';

type LabeledCheckboxProps = {
  readonly label: string;
  readonly onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  readonly onClick: () => void;
  readonly className?: string;
  readonly tooltip?: string;
  readonly id?: string;
  readonly testId?: string;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly disabledTooltip?: string;
  readonly hasError?: boolean;
};

const LabeledCheckboxImpl: ForwardRefRenderFunction<
  HTMLInputElement,
  LabeledCheckboxProps
> = (
  {
    label,
    onBlur,
    onClick,
    className,
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
        data-testid={testId}
        className={twMerge(
          'icon-check appearance-none text-[18px]',
          'focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-solid',
          selected
            ? labeledContainerInputStyles.selected
            : labeledContainerInputStyles.unselected,
        )}
        type="checkbox"
        onChange={onClick}
        onBlur={onBlur}
        checked={selected}
        disabled={disabled}
        ref={ref}
      />
    </LabeledContainer>
  );
};

export const LabeledCheckbox = forwardRef(LabeledCheckboxImpl);
