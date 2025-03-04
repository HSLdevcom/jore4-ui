import { FC } from 'react';
import { ExpandButton } from './ExpandButton';

type ChevronToggleProps = {
  readonly className?: string;
  readonly isToggled: boolean;
  readonly testId?: string;
  readonly onClick: () => void;
  readonly controls: string;
  readonly openTooltip: string;
  readonly closeTooltip: string;
};

export const ChevronToggle: FC<ChevronToggleProps> = ({
  className,
  isToggled,
  onClick,
  testId,
  controls,
  openTooltip,
  closeTooltip,
}) => {
  return (
    <ExpandButton
      ariaControls={controls}
      className={className}
      expanded={isToggled}
      expandedText=""
      onClick={onClick}
      testId={testId}
      title={isToggled ? closeTooltip : openTooltip}
    />
  );
};
