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
  const colorClassNames = inverted
    ? 'border-grey bg-white text-gray-900 hover:border-brand active:border-brand'
    : 'border-brand bg-brand text-white hover:bg-opacity-50 active:bg-opacity-50';
  const disabledClassNames = disabled ? 'pointer-events-none opacity-70' : '';

  const commonClassNames = `font-bold border w-20 rounded text-sm font-light ${colorClassNames} ${disabledClassNames} `;

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
