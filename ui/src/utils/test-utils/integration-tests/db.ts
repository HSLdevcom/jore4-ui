import {
  hasuraApi,
  InfraLinkInsertInput,
  insertVehicleSubmodeOnInfraLink,
  JourneyPatternJourneyPatternInsertInput,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  LineInsertInput,
  mapToCreateInfraLinkAlongRouteMutation,
  mapToCreateInfraLinksMutation,
  mapToCreateJourneyPatternsMutation,
  mapToCreateLinesMutation,
  mapToCreateRoutesMutation,
  mapToCreateStopsMutation,
  mapToCreateStopsOnJourneyPatternMutation,
  mapToDeleteInfraLinksAlongRouteMutation,
  mapToDeleteInfraLinksMutation,
  mapToDeleteJourneyPatternsMutation,
  mapToDeleteLinesMutation,
  mapToDeleteRoutesMutation,
  mapToDeleteStopsInJourneyPatternMutation,
  mapToDeleteStopsMutation,
  removeVehicleSubmodeOnInfraLink,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteInsertInput,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseLogger = (message: string, res: any) => {
  if (res.errors) {
    // eslint-disable-next-line no-console
    console.log(`${message}:`, res);
  }
};

interface SupportedResources {
  infraLinks?: InfraLinkInsertInput[];
  vehicleSubmodeOnInfrastructureLink?: VehicleSubmodeOnInfraLinkInsertInput[];
  lines?: LineInsertInput[];
  stops?: StopInsertInput[];
  routes?: RouteInsertInput[];
  infraLinksAlongRoute?: RouteInfrastructureLinkAlongRouteInsertInput[];
  journeyPatterns?: JourneyPatternJourneyPatternInsertInput[];
  stopsInJourneyPattern?: JourneyPatternScheduledStopPointInJourneyPatternInsertInput[];
}

export const insertToDbHelper = async ({
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
  lines,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (infraLinks) {
    const mutation = mapToCreateInfraLinksMutation(infraLinks);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting infra links', res),
    );
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    await insertVehicleSubmodeOnInfraLink(
      vehicleSubmodeOnInfrastructureLink,
    ).then((res: ExplicitAny) =>
      responseLogger('Inserting vehicle submodes on infra links', res),
    );
  }
  if (lines) {
    const mutation = mapToCreateLinesMutation(lines);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting lines', res),
    );
  }
  if (stops) {
    const mutation = mapToCreateStopsMutation(stops);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting stops', res),
    );
  }
  if (routes) {
    const mutation = mapToCreateRoutesMutation(routes);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting routes', res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation =
      mapToCreateInfraLinkAlongRouteMutation(infraLinksAlongRoute);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting infra links along route', res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToCreateJourneyPatternsMutation(journeyPatterns);
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting journey patterns', res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToCreateStopsOnJourneyPatternMutation(
      stopsInJourneyPattern,
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Inserting stops in journey pattern', res),
    );
  }
};

export const removeFromDbHelper = async ({
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
  lines,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (routes) {
    const mutation = mapToDeleteRoutesMutation(
      routes.map((item) => item.route_id),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing routes', res),
    );
  }
  if (lines) {
    const mutation = mapToDeleteLinesMutation(
      lines.map((item) => item.line_id),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing lines', res),
    );
  }
  if (stops) {
    const mutation = mapToDeleteStopsMutation(
      stops.map((item) => item.scheduled_stop_point_id),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing stops', res),
    );
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    await removeVehicleSubmodeOnInfraLink(
      vehicleSubmodeOnInfrastructureLink,
    ).then((res: ExplicitAny) =>
      responseLogger('Removing vehicle submodes on infra links', res),
    );
  }
  if (infraLinks) {
    const mutation = mapToDeleteInfraLinksMutation(
      infraLinks.map((item) => item.infrastructure_link_id),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing infra links', res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation = mapToDeleteInfraLinksAlongRouteMutation(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      infraLinksAlongRoute.map((item) => item.infrastructure_link_id!),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing infra links along route', res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToDeleteJourneyPatternsMutation(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journeyPatterns.map((item) => item.journey_pattern_id!),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing journey patterns', res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToDeleteStopsInJourneyPatternMutation(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopsInJourneyPattern.map((item) => item.journey_pattern_id!),
    );
    await hasuraApi(mutation).then((res) =>
      responseLogger('Removing stops in journey pattern', res),
    );
  }
};
