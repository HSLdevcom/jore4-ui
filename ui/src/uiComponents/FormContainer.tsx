import { FC, PropsWithChildren } from 'react';

type FormContainerProps = {
  readonly className?: string;
};

export const FormContainer: FC<PropsWithChildren<FormContainerProps>> = ({
  className = '',
  children,
}) => {
  return (
    <div
      className={`rounded-md border border-light-grey bg-background ${className}`}
    >
      {children}
    </div>
  );
};
