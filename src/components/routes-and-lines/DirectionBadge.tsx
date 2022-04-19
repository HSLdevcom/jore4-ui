import { RouteDirectionEnum } from '../../generated/graphql';

type Props = {
  direction: RouteDirectionEnum;
  onToggle?: () => void;
};

export const DirectionBadge = ({ direction, onToggle }: Props) => {
  return (
    <span className="relative mr-4 flex h-12 w-12 items-center justify-center bg-brand text-white">
      {direction === RouteDirectionEnum.Outbound ? '1' : '2'}
      {onToggle && (
        <button onClick={onToggle} type="button">
          <i className="icon-opposite border-brank absolute -bottom-2 -right-2 rounded-full border bg-white text-sm text-brand" />
        </button>
      )}
    </span>
  );
};
