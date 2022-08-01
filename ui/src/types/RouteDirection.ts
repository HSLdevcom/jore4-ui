import { RouteDirectionEnum } from '../generated/graphql';

// limit route direction enum only to have 'outbound' and 'inbound' values
export const RouteDirection = {
  Outbound: RouteDirectionEnum.Outbound,
  Inbound: RouteDirectionEnum.Inbound,
};

export type RouteDirection =
  typeof RouteDirectionEnum[keyof typeof RouteDirection];
