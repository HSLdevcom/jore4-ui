import { FC, ReactNode } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { twJoin } from 'tailwind-merge';
import { TextAndIconButton } from './TextAndIconButton';

type AddNewButtonProps = {
  readonly className?: string;
  readonly label?: ReactNode;
  readonly onClick?: () => void;
  readonly testId: string;
};

export const AddNewButton: FC<AddNewButtonProps> = ({
  className,
  label,
  onClick,
  testId,
}) => {
  return (
    <TextAndIconButton
      className={twJoin(
        'gap-4 font-bold text-brand hover:text-black',
        className,
      )}
      data-testid={testId}
      icon={<AiFillPlusCircle className="text-3xl" />}
      onClick={onClick}
      text={label}
      type="button"
    />
  );
};
