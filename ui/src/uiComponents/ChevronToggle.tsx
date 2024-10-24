import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

type Props = {
  className?: string;
  isToggled: boolean;
  testId?: string;
  onClick: () => void;
  controls: string;
  openTooltip: string;
  closeTooltip: string;
};

export const ChevronToggle = ({
  className,
  isToggled,
  onClick,
  testId,
  controls,
  openTooltip,
  closeTooltip,
}: Props): React.ReactElement => {
  const iconClassName = 'text-3xl text-tweaked-brand';
  return (
    <IconButton
      className={className}
      tooltip={isToggled ? closeTooltip : openTooltip}
      onClick={onClick}
      icon={
        isToggled ? (
          <FaChevronUp className={iconClassName} aria-hidden />
        ) : (
          <FaChevronDown className={iconClassName} aria-hidden />
        )
      }
      ariaAttributes={{
        ariaExpanded: isToggled,
        ariaControls: controls,
      }}
      testId={testId}
    />
  );
};
