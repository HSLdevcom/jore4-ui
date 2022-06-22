import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

type Props = {
  direction: RouteDirectionEnum;
};

export const DirectionBadge = ({ direction }: Props) => {
  return (
    <span className="relative mr-4 flex h-12 w-12 items-center justify-center bg-brand text-white">
      <span data-testid="direction-value">
        {mapDirectionToShortUiName(direction)}
      </span>
      <i className="icon-opposite border-brank absolute -bottom-2 -right-2 rounded-full border bg-white text-sm text-brand" />
    </span>
  );
};
