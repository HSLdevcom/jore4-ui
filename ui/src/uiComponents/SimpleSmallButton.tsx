import { FC } from 'react';
import { SimpleButton } from './SimpleButton';

type SimpleSmallButtonProps = {
  readonly id?: string;
  readonly label: string;
  readonly inverted?: boolean;
  readonly onClick: () => void;
  readonly testId?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly tooltip?: string;
  readonly disabledTooltip?: string;
  readonly ariaSelected?: boolean;
  readonly role?: string;
  readonly ariaControls?: string;
};

export const SimpleSmallButton: FC<SimpleSmallButtonProps> = ({
  id,
  label,
  inverted,
  onClick,
  testId,
  className = '',
  disabled,
  tooltip,
  disabledTooltip,
  ariaSelected,
  role,
  ariaControls,
}) => {
  const commonClassNames = `!rounded text-sm font-light py-0`;

  return (
    <SimpleButton
      id={id}
      onClick={onClick}
      testId={testId}
      className={`${commonClassNames} ${className}`}
      disabled={disabled}
      invertedClassName="!text-gray-900"
      inverted={inverted}
      tooltip={tooltip}
      disabledTooltip={disabledTooltip}
      aria-selected={ariaSelected}
      aria-controls={ariaControls}
      role={role}
    >
      {label}
    </SimpleButton>
  );
};
