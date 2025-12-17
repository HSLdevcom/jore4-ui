import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type FormContainerProps = {
  readonly className?: string;
};

export const FormContainer: FC<PropsWithChildren<FormContainerProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={twMerge(
        'rounded-md border border-light-grey bg-background',
        className,
      )}
    >
      {children}
    </div>
  );
};
