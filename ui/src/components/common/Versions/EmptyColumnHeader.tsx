import { FC } from 'react';

type EmptyColumnHeaderProps = {
  readonly className?: string;
};

export const EmptyColumnHeader: FC<EmptyColumnHeaderProps> = ({
  className,
}) => (
  // eslint-disable-next-line jsx-a11y-x/control-has-associated-label
  <td className={className} />
);
