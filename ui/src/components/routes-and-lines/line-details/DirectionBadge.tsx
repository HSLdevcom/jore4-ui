import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

const testIds = {
  container: 'DirectionBadge::container',
  directionBadge: (direction: RouteDirectionEnum) =>
    `DirectionBadge::${direction}`,
};
export const directionBadgeTestIds = testIds;

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
      data-testid={testIds.container}
      className={`relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white ${className}`}
    >
      <span data-testid={testIds.directionBadge(direction)}>
        {mapDirectionToShortUiName(direction)}
      </span>
    </span>
  );
};
