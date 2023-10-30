import { SimpleButton } from './SimpleButton';

type Props = {
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  disabledTooltip?: string;
};

export const SimpleSmallButton = ({
  label,
  inverted,
  onClick,
  testId,
  className = '',
  disabled,
  tooltip,
  disabledTooltip,
}: Props): JSX.Element => {
  const commonClassNames = `!rounded text-sm font-light py-0`;

  return (
    <SimpleButton
      onClick={onClick}
      testId={testId}
      className={`${commonClassNames} ${className}`}
      disabled={disabled}
      invertedClassName="!text-gray-900"
      inverted={inverted}
      tooltip={tooltip}
      disabledTooltip={disabledTooltip}
    >
      {label}
    </SimpleButton>
  );
};
