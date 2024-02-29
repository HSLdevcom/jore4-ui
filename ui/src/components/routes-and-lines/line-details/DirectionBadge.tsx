import { useTranslation } from 'react-i18next';
import { RouteDirectionEnum } from '../../../generated/graphql';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';

const testIds = {
  container: 'DirectionBadge::container',
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
  return (
    <span
      title={t(`directionEnum.${direction}`)}
      data-testid={testIds.container}
      className={`relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white ${className}`}
    >
      <span data-testid={testIds.directionBadge(direction)}>
        {mapDirectionToShortUiName(direction)}
      </span>
    </span>
  );
};
