import { twMerge } from 'tailwind-merge';

interface Props {
  active: boolean;
  onToggle: (active: boolean) => void;
  disabled?: boolean;
  className?: string;
  iconClassName: string;
  testId: string;
}

export const IconToggle = ({
  active,
  onToggle,
  disabled = false,
  className = '',
  iconClassName = '',
  testId,
}: Props): JSX.Element => {
  const colorClassNames = active
    ? 'bg-tweaked-brand text-white'
    : 'bg-white text-tweaked-brand';
  const disabledClassNames = disabled ? 'text-white bg-light-grey' : '';
  return (
    <button
      data-testid={testId}
      type="button"
      disabled={disabled}
      className={twMerge(`rounded border border-gray-300
        ${colorClassNames}
        ${disabledClassNames}
        ${className}`)}
      onClick={() => onToggle(!active)}
    >
      <i
        className={`text-5xl ${iconClassName}`}
        // our icon library's css file adds margins with ::before pseudo element and this inline style is hack to get rid of those
        style={{ marginLeft: '-.2em', marginRight: '-0.2em' }}
      />
    </button>
  );
};
