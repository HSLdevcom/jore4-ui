import { FC } from 'react';

type TerminalMarkerProps = {
  readonly selected?: boolean;
  readonly isPlaceholder?: boolean;
  readonly size?: number;
  readonly testId?: string;
};

export const TerminalMarker: FC<TerminalMarkerProps> = ({
  selected = false,
  isPlaceholder = false,
  size = 30,
  testId,
}) => {
  const width = `${size}px`;
  const fontSize = `${size + 15}px`;

  return (
    <div
      data-placeholder={isPlaceholder}
      data-selected={selected}
      data-testid={testId}
      className="flex cursor-pointer items-center justify-center rounded bg-tweaked-brand text-white hover:bg-tweaked-brand-darker30 data-[placeholder=true]:bg-dark-grey data-[selected=true]:bg-hsl-dark-80"
      style={{ width, height: width, fontSize }}
      aria-hidden
    >
      <i className="icon-bus" />
    </div>
  );
};
