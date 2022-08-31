import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

const testIds = {
  value: 'DirectionBadge::value',
};

type Props = {
  direction: RouteDirectionEnum;
};

export const DirectionBadge = ({ direction }: Props) => {
  return (
    <span className="relative mr-4 flex h-12 w-12 items-center justify-center bg-brand text-2xl font-bold text-white">
      <span data-testid={testIds.value}>
        {mapDirectionToShortUiName(direction)}
      </span>
      <i className="icon-opposite border-brank absolute -bottom-2 -right-2 rounded-full border bg-white text-sm text-brand" />
    </span>
  );
};
