import { FC, PropsWithChildren } from 'react';
import { Column } from '../../../layoutComponents';

type FormColumnProps = {
  readonly className?: string;
  readonly id?: string;
};

export const FormColumn: FC<PropsWithChildren<FormColumnProps>> = ({
  className = '',
  id,
  children,
}) => {
  return (
    <Column className={`${className} w-full space-y-5`} id={id}>
      {children}
    </Column>
  );
};
