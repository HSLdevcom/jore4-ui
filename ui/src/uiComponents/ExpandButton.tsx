import { FC, JSX, ReactNode } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { TextAndIconButton } from './TextAndIconButton';

type AllowedButtonProps = Omit<
  JSX.IntrinsicElements['button'],
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-pressed'
  | 'children'
  | 'onClick'
  | 'type'
>;

type CustomExpandButtonProps = {
  readonly className?: string;
  readonly iconClassName?: string;
  readonly expanded: boolean;
  readonly expandedText: ReactNode;
  readonly collapsedText?: ReactNode;
  readonly onClick: () => void;
  readonly testId?: string;
};

type ForAccordionProps = {
  readonly forSorting?: false;
  readonly ariaControls: string;
};

type ForSortingProps = {
  readonly forSorting: true;
  readonly ariaControls?: never;
};

type ExpandButtonProps = AllowedButtonProps &
  CustomExpandButtonProps &
  (ForAccordionProps | ForSortingProps);

export const ExpandButton: FC<ExpandButtonProps> = ({
  forSorting = false,
  ariaControls,
  className,
  iconClassName,
  expanded,
  expandedText,
  collapsedText = expandedText,
  onClick,
  testId,
  ...buttonProps
}) => {
  return (
    <TextAndIconButton
      className={className}
      icon={
        <FaChevronUp
          className={twMerge(
            'text-3xl text-tweaked-brand transition-transform',
            expanded ? null : '-scale-y-100',
            iconClassName,
          )}
        />
      }
      text={expanded ? expandedText : collapsedText}
      type="button"
      testId={testId}
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(forSorting
        ? { 'aria-pressed': expanded }
        : {
            'aria-expanded': expanded,
            'aria-controls': ariaControls,
          })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    />
  );
};
