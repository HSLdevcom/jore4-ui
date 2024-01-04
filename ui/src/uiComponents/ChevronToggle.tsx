import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

type Props = {
  isToggled: boolean;
  testId?: string;
  onClick: () => void;
  controls: string;
  openTooltip: string;
  closeTooltip: string;
};

export const ChevronToggle = ({
  isToggled,
  onClick,
  testId,
  controls,
  openTooltip,
  closeTooltip,
}: Props): JSX.Element => {
  const iconClassName = 'text-3xl text-tweaked-brand';
  return (
    <IconButton
      title={isToggled ? closeTooltip : openTooltip}
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
