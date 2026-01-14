import { FC, PropsWithChildren } from 'react';
import { twJoin } from 'tailwind-merge';
import { Column } from '../../../layoutComponents';

type FormColumnProps = {
  readonly className?: string;
  readonly id?: string;
};

export const FormColumn: FC<PropsWithChildren<FormColumnProps>> = ({
  className,
  id,
  children,
}) => {
  return (
    <Column className={twJoin('w-full gap-5', className)} id={id}>
      {children}
    </Column>
  );
};
