import { SimpleButton } from './SimpleButton';

type Props = {
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
  disabled?: boolean;
};

export const SimpleSmallButton = ({
  label,
  inverted,
  onClick,
  testId,
  className = '',
  disabled,
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
    >
      {label}
    </SimpleButton>
  );
};
