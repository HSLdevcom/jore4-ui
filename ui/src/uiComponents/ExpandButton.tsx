import React, { FC, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { TextAndIconButton } from './TextAndIconButton';

type AllowedButtonProps = Omit<
  React.JSX.IntrinsicElements['button'],
  'aria-controls' | 'aria-expanded' | 'children' | 'onClick' | 'type'
>;

type CustomExpandButtonProps = {
  readonly ariaControls: string;
  readonly className?: string;
  readonly iconClassName?: string;
  readonly expanded: boolean;
  readonly expandedText: ReactNode;
  readonly collapsedText?: ReactNode;
  readonly onClick: () => void;
  readonly testId?: string;
};

type ExpandButtonProps = AllowedButtonProps & CustomExpandButtonProps;

export const ExpandButton: FC<ExpandButtonProps> = ({
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
        <FaChevronDown
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
      aria-expanded={expanded}
      aria-controls={ariaControls}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    />
  );
};
