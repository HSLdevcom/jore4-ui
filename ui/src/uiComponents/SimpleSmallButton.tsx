type Props = {
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
};

const commonClassNames = 'font-bold border w-20 rounded text-sm font-light';

export const SimpleSmallButton = ({
  label,
  inverted,
  onClick,
  testId,
  className = '',
}: Props): JSX.Element => (
  <button
    onClick={onClick}
    type="button"
    data-testid={testId}
    className={`${commonClassNames} ${
      inverted
        ? 'border-grey bg-white text-gray-900 hover:border-brand active:border-brand'
        : 'border-brand bg-brand text-white hover:bg-opacity-50 active:bg-opacity-50'
    } ${className}`}
  >
    {label}
  </button>
);
