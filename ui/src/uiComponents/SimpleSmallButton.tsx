import { SimpleButton } from './SimpleButton';

type Props = {
  id?: string;
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  disabledTooltip?: string;
  ariaSelected?: boolean;
  role?: string;
  ariaControls?: string;
};

export const SimpleSmallButton = ({
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
}: Props): React.ReactElement => {
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
