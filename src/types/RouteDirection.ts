import { RouteDirectionEnum } from '../generated/graphql';

export const RouteDirection = {
  Outbound: RouteDirectionEnum.Outbound,
  Inbound: RouteDirectionEnum.Inbound,
};

export type RouteDirection =
  typeof RouteDirectionEnum[keyof typeof RouteDirection];
