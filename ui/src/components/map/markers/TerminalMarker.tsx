import { FC, MouseEventHandler } from 'react';

type TerminalMarkerProps = {
  readonly selected?: boolean;
  readonly isPlaceholder?: boolean;
  readonly onClick?: MouseEventHandler<HTMLDivElement>;
  readonly size?: number;
  readonly testId?: string;
  readonly title?: string;
};

export const TerminalMarker: FC<TerminalMarkerProps> = ({
  onClick,
  selected = false,
  isPlaceholder = false,
  size = 30,
  testId,
  title,
}) => {
  const width = `${size}px`;
  const fontSize = `${size + 15}px`;

  return (
    <div
      data-placeholder={isPlaceholder}
      data-selected={selected}
      data-testid={testId}
      className="flex cursor-pointer items-center justify-center rounded bg-tweaked-brand text-white hover:bg-tweaked-brand-darker30 data-[placeholder=true]:border data-[placeholder=true]:border-dashed data-[placeholder=true]:border-grey data-[placeholder=true]:bg-white data-[selected=true]:bg-background-hsl-button-selected"
      style={{ width, height: width, fontSize }}
      aria-hidden
      onClick={onClick}
      title={title}
    >
      <i
        data-placeholder={isPlaceholder}
        className="icon-bus data-[placeholder=true]:text-grey"
      />
    </div>
  );
};
