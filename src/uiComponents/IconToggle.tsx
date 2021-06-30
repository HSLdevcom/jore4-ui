import React from 'react';

interface Props {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
  iconClassName: string;
}

export const IconToggle = ({
  enabled,
  onToggle,
  className,
  iconClassName,
}: Props): JSX.Element => {
  return (
    <button
      type="button"
      className={`border border-gray-300 rounded ${
        enabled ? 'bg-tweaked-brand text-white' : 'bg-white text-tweaked-brand'
      } ${className}`}
      onClick={() => onToggle(!enabled)}
    >
      <i
        className={`text-5xl ${iconClassName}`}
        // our icon library's css file adds margins with ::before pseudo element and this inline style is hack to get rid of those
        style={{ marginLeft: '-.2em', marginRight: '-0.2em' }}
      />
    </button>
  );
};
