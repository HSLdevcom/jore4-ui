import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

type IconToggleProps = {
  readonly active: boolean;
  readonly onToggle: (active: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly iconClassName: string;
  readonly testId: string;
  readonly tooltip: string;
};

export const IconToggle: FC<IconToggleProps> = ({
  active,
  onToggle,
  disabled = false,
  className = '',
  iconClassName = '',
  testId,
  tooltip,
}) => {
  const colorClassNames = active
    ? 'bg-tweaked-brand text-white'
    : 'bg-white text-tweaked-brand';
  const disabledClassNames = disabled ? 'text-white bg-light-grey' : '';

  return (
    // Button has a title attribute & visual icon
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-testid={testId}
      type="button"
      disabled={disabled}
      className={twMerge(
        'rounded border border-gray-300',
        colorClassNames,
        disabledClassNames,
        className,
      )}
      onClick={() => onToggle(!active)}
      aria-disabled={active}
      title={tooltip}
    >
      <i
        className={`text-xl ${iconClassName} aria-hidden`}
        // our icon library's css file adds margins with ::before pseudo element and this inline style is hack to get rid of those
        style={{ marginLeft: '-.2em', marginRight: '-0.2em' }}
      />
    </button>
  );
};
