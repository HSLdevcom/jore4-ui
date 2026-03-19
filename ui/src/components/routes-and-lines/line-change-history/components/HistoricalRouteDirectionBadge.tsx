import { FC } from 'react';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { DirectionBadge } from '../../line-details/DirectionBadge';
import { LineChangeHistoryItem } from '../types';

type HistoricalRouteDirectionBadgeProps = {
  readonly item: LineChangeHistoryItem;
};
export const HistoricalRouteDirectionBadge: FC<
  HistoricalRouteDirectionBadgeProps
> = ({ item }) => {
  return (
    <DirectionBadge
      className="inline-flex h-6 w-6 text-base"
      direction={item.routeDirection as RouteDirectionEnum}
    />
  );
};
