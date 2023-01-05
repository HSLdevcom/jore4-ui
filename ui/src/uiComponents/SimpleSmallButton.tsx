type Props = {
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
  disabled?: boolean;
};

const getHoverStyles = (inverted = false, disabled = false) => {
  if (disabled) {
    return '';
  }

  return inverted ? `hover:border-brand` : `hover:bg-opacity-50`;
};

export const SimpleSmallButton = ({
  label,
  inverted,
  onClick,
  testId,
  className = '',
  disabled,
}: Props): JSX.Element => {
  const colorClassNames = inverted
    ? 'border-grey bg-white text-gray-900 active:border-brand'
    : 'border-brand bg-brand text-white active:bg-opacity-50';
  const disabledClassNames = disabled ? 'cursor-not-allowed opacity-70' : '';

  const commonClassNames = `font-bold border w-20 rounded text-sm font-light ${colorClassNames} ${getHoverStyles(
    inverted,
    disabled,
  )} ${disabledClassNames} `;

  return (
    <button
      onClick={onClick}
      type="button"
      data-testid={testId}
      className={`${commonClassNames} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
