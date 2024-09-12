import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type DetailRowProps = PropsWithChildren & {
  readonly className?: string;
};

export const DetailRow: FC<DetailRowProps> = ({ children, className }) => {
  return (
    <div className={twMerge('mb-1 flex flex-row gap-8 py-2', className)}>
      {children}
    </div>
  );
};
