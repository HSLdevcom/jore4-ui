import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

const testIds = {
  directionBadge: (direction: RouteDirectionEnum) =>
    `DirectionBadge::${direction}`,
};

type Props = {
  titleName: string;
  direction: RouteDirectionEnum;
  className?: string;
};

export const DirectionBadge = ({
  titleName,
  direction,
  className = '',
}: Props) => {
  return (
    <span
      title={titleName}
      className={`relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white ${className}`}
    >
      <span data-testid={testIds.directionBadge(direction)}>
        {mapDirectionToShortUiName(direction)}
      </span>
    </span>
  );
};
