import { FC, ReactNode } from 'react';

type ActionButtonsTdProps = {
  readonly actionButtons: ReactNode;
  readonly className?: string;
};

export const ActionButtonsTd: FC<ActionButtonsTdProps> = ({
  actionButtons,
  className,
}) => (
  <td className={className}>
    <div className="flex">{actionButtons}</div>
  </td>
);
