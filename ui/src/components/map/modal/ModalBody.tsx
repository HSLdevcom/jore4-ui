import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalBodyProps = {
  readonly className?: string;
  readonly children: ReactNode;
  readonly testId?: string;
};

export const ModalBody: FC<ModalBodyProps> = ({
  className = '',
  children,
  testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={twMerge(`mx-12 my-8 border-x border-light-grey`, className)}
    >
      {children}
    </div>
  );
};
