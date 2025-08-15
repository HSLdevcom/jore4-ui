import { FC, JSX, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CustomTextAndIconButtonProps = {
  readonly icon: ReactNode;
  readonly testId?: string;
  readonly text: ReactNode;
  readonly type: Exclude<JSX.IntrinsicElements['button']['type'], undefined>;
};

type AllowedButtonProps = Omit<
  JSX.IntrinsicElements['button'],
  'children' | 'type'
>;

type TextAndIconButtonProps = AllowedButtonProps & CustomTextAndIconButtonProps;

export const TextAndIconButton: FC<TextAndIconButtonProps> = ({
  className,
  icon,
  testId,
  text,
  type,
  ...buttonProps
}) => {
  return (
    <button
      data-testid={testId}
      className={twMerge('flex items-center gap-2', className)}
      // eslint-disable-next-line react/button-has-type
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {text}
      {icon}
    </button>
  );
};
