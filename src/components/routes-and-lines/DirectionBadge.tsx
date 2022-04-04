import { RouteDirectionEnum } from '../../generated/graphql';

type Props = {
  direction: RouteDirectionEnum;
};

export const DirectionBadge = ({ direction }: Props) => {
  return (
    <span className="relative mr-4 flex h-12 w-12 items-center justify-center bg-brand text-white">
      {direction === RouteDirectionEnum.Outbound ? '1' : '2'}
      <i className="icon-opposite border-brank absolute -bottom-2 -right-2 rounded-full border bg-white text-sm text-brand" />
    </span>
  );
};
