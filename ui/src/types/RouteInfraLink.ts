type InfrastructureLinkDefaultFields = {
  readonly __typename?: 'infrastructure_network_infrastructure_link';
  readonly infrastructure_link_id: UUID;
};

// An extended version of the infra link model that also contains information about the route
export type RouteInfraLink<TLink extends InfrastructureLinkDefaultFields> =
  TLink & {
    readonly is_traversal_forwards: boolean;
  };
