import { FC, ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';
import { TextAndIconButton } from './TextAndIconButton';

type CloseIconButtonProps = {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly label?: ReactNode;
  readonly onClick: () => void;
  readonly testId: string;
  readonly title?: string;
};

export const CloseIconButton: FC<CloseIconButtonProps> = ({
  ariaLabel,
  className,
  label,
  onClick,
  testId,
  title,
}) => {
  return (
    <TextAndIconButton
      aria-label={ariaLabel}
      className={twJoin('gap-4', className)}
      data-testid={testId}
      icon={<i className="icon-close-large text-lg" aria-hidden="true" />}
      onClick={onClick}
      text={label}
      type="button"
      title={title}
    />
  );
};
