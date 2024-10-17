import { useTranslation } from 'react-i18next';
import { RouteDirectionEnum } from '../../../generated/graphql';
import {
  mapDirectionToSymbol,
  mapDirectionToUiName,
} from '../../../i18n/uiNameMappings';

const testIds = {
  container: 'DirectionBadge',
  directionBadge: (direction: RouteDirectionEnum) =>
    `DirectionBadge::${direction}`,
};
export const directionBadgeTestIds = testIds;

type Props = {
  direction: RouteDirectionEnum;
  className?: string;
};

export const DirectionBadge = ({ direction, className = '' }: Props) => {
  const { t } = useTranslation();

  const directionText = mapDirectionToUiName(t, direction);
  return (
    <span
      title={directionText}
      data-testid={testIds.container}
      className={`relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white ${className}`}
    >
      <span
        aria-hidden
        aria-label={directionText}
        data-testid={testIds.directionBadge(direction)}
      >
        {mapDirectionToSymbol(t, direction)}
      </span>
    </span>
  );
};
