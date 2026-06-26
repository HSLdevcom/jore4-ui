import { FC } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { IconButton } from './IconButton';

const baseIconClassName = 'text-3xl text-tweaked-brand pointer-events-none';

type AccordionButtonProps = {
  readonly testId: string;
  readonly onToggle: (isOpen: boolean) => void;
  readonly isOpen: boolean;
  readonly className?: string;
  readonly iconClassName?: string;
  readonly controls: string;
  readonly openTooltip: string;
  readonly closeTooltip: string;
  readonly ariaLabel?: string;
  readonly identifier?: string;
};

/**
 * A button that could be used as the toggle button of a section that can be hidden or shown.
 * Contains logic to handle up and down chevrons (V-shape), that indicate the state for visual users.
 * @param controls is required to indicate to screen readers what the button controls.
 * @param openTooltip and `closeTooltip` should primarily be used for cases where there's no text or `<label>` for the button, e.g. if there's only an icon.
 * @param ariaLabel should be used if the button's text or `<label>` is clear for visual users, making the tooltip redundant, but requires more context for screen readers.
 * @returns
 */
export const AccordionButton: FC<AccordionButtonProps> = ({
  testId,
  onToggle,
  isOpen,
  className,
  iconClassName,
  controls,
  openTooltip,
  closeTooltip,
  ariaLabel,
  identifier,
}) => {
  const tooltip = isOpen ? closeTooltip : openTooltip;

  return (
    <IconButton
      identifier={identifier}
      tooltip={tooltip}
      testId={testId}
      onClick={() => onToggle(!isOpen)}
      icon={
        isOpen ? (
          <MdKeyboardArrowUp
            className={twMerge(baseIconClassName, iconClassName)}
            aria-hidden
          />
        ) : (
          <MdKeyboardArrowDown
            className={twMerge(baseIconClassName, iconClassName)}
            aria-hidden
          />
        )
      }
      className={className}
      ariaAttributes={{
        ariaExpanded: isOpen,
        ariaControls: controls ?? '',
        ariaLabel,
      }}
    />
  );
};
