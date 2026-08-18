import { FC } from 'react';
import { RouteDirectionEnum } from '../../../../../generated/graphql';
import { DirectionBadge } from '../../Details/DirectionBadge';
import { LineChangeHistoryItem } from '../Types';

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
