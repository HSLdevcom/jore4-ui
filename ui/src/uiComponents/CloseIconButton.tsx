import { FC, ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';
import { TextAndIconButton } from './TextAndIconButton';

type CloseIconButtonProps = {
  readonly className?: string;
  readonly label?: ReactNode;
  readonly onClick: () => void;
  readonly testId: string;
};

export const CloseIconButton: FC<CloseIconButtonProps> = ({
  className,
  label,
  onClick,
  testId,
}) => {
  return (
    <TextAndIconButton
      className={twJoin('gap-4', className)}
      data-testid={testId}
      icon={<i className="icon-close-large text-lg" />}
      onClick={onClick}
      text={label}
      type="button"
    />
  );
};
