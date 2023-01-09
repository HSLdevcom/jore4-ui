import { buildGetButtonClassNamesFunction } from '../utils/classNames';

type Props = {
  label: string;
  inverted?: boolean;
  onClick: () => void;
  testId?: string;
  className?: string;
  disabled?: boolean;
};

const getButtonClassNames = buildGetButtonClassNamesFunction({
  commonClassNames: 'font-bold border w-20 rounded text-sm font-light',
  colorClassNames: 'border-brand bg-brand text-white active:bg-opacity-50',
  invertedColorClassNames:
    'border-grey bg-white text-gray-900 active:border-brand',
  hoverClassNames: 'hover:bg-opacity-50',
  invertedHoverClassNames: 'hover:border-brand',
});

export const SimpleSmallButton = ({
  label,
  inverted,
  onClick,
  testId,
  className = '',
  disabled,
}: Props): JSX.Element => {
  const defaultClassNames = getButtonClassNames(disabled, inverted);

  return (
    <button
      onClick={onClick}
      type="button"
      data-testid={testId}
      className={`${defaultClassNames} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
