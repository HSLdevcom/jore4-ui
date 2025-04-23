import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalBodyProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

export const ModalBody: FC<ModalBodyProps> = ({ className = '', children }) => {
  return (
    <div
      className={twMerge(`mx-12 my-8 border-x border-light-grey`, className)}
    >
      {children}
    </div>
  );
};
