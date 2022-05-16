import { InfrastructureLinkAlongRoute } from '../../graphql';

export interface RouteGeometry {
  stopIdsWithinRoute: UUID[];
  infraLinksAlongRoute: InfrastructureLinkAlongRoute[];
}
