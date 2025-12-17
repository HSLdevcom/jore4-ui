import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
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

type DirectionBadgeProps = {
  readonly direction: RouteDirectionEnum;
  readonly className?: string;
};

export const DirectionBadge: FC<DirectionBadgeProps> = ({
  direction,
  className,
}) => {
  const { t } = useTranslation();

  const directionText = mapDirectionToUiName(t, direction);
  return (
    <span
      title={directionText}
      data-testid={testIds.container}
      className={twMerge(
        'relative flex h-9 w-9 items-center justify-center bg-brand text-2xl font-bold text-white',
        className,
      )}
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
