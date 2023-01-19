import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

const testIds = {
  value: 'DirectionBadge::value',
};

type Props = {
  direction: RouteDirectionEnum;
  className?: string;
};

export const DirectionBadge = ({ direction, className = '' }: Props) => {
  return (
    <span
      className={`relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white ${className}`}
    >
      <span data-testid={testIds.value}>
        {mapDirectionToShortUiName(direction)}
      </span>
      <i className="icon-opposite border-brank absolute -bottom-2 -right-2 rounded-full border bg-white text-sm text-brand" />
    </span>
  );
};
