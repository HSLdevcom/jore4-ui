import {
  InfraLinkAlongRouteInsertInput,
  InfraLinkInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
  e2eDatabaseConfig,
  getDbConnection,
  hasuraApi,
  insertVehicleSubmodeOnInfraLink,
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
} from '@hsl/jore4-test-db-manager';

const logOnError = (message: string, res: ExplicitAny) => {
  if (res.errors) {
    // eslint-disable-next-line no-console
    console.log(`${message}:`, res);
  }
};

type SupportedResources = {
  readonly infraLinks?: InfraLinkInsertInput[];
  readonly vehicleSubmodeOnInfrastructureLink?: VehicleSubmodeOnInfraLinkInsertInput[];
  readonly lines?: LineInsertInput[];
  readonly stops?: StopInsertInput[];
  readonly routes?: RouteInsertInput[];
  readonly infraLinksAlongRoute?: InfraLinkAlongRouteInsertInput[];
  readonly journeyPatterns?: JourneyPatternInsertInput[];
  readonly stopsInJourneyPattern?: StopInJourneyPatternInsertInput[];
};

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
      logOnError('Inserting infra links', res),
    );
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    const db = getDbConnection(e2eDatabaseConfig);
    await insertVehicleSubmodeOnInfraLink(
      db,
      vehicleSubmodeOnInfrastructureLink,
    ).then((res: ExplicitAny) =>
      logOnError('Inserting vehicle submodes on infra links', res),
    );
    db.destroy();
  }
  if (lines) {
    const mutation = mapToCreateLinesMutation(lines);
    await hasuraApi(mutation).then((res) => logOnError('Inserting lines', res));
  }
  if (stops) {
    const mutation = mapToCreateStopsMutation(stops);
    await hasuraApi(mutation).then((res) => logOnError('Inserting stops', res));
  }
  if (routes) {
    const mutation = mapToCreateRoutesMutation(routes);
    await hasuraApi(mutation).then((res) =>
      logOnError('Inserting routes', res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation =
      mapToCreateInfraLinkAlongRouteMutation(infraLinksAlongRoute);
    await hasuraApi(mutation).then((res) =>
      logOnError('Inserting infra links along route', res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToCreateJourneyPatternsMutation(journeyPatterns);
    await hasuraApi(mutation).then((res) =>
      logOnError('Inserting journey patterns', res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToCreateStopsOnJourneyPatternMutation(
      stopsInJourneyPattern,
    );
    await hasuraApi(mutation).then((res) =>
      logOnError('Inserting stops in journey pattern', res),
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
    await hasuraApi(mutation).then((res) => logOnError('Removing routes', res));
  }
  if (lines) {
    const mutation = mapToDeleteLinesMutation(
      lines.map((item) => item.line_id),
    );
    await hasuraApi(mutation).then((res) => logOnError('Removing lines', res));
  }
  if (stops) {
    const mutation = mapToDeleteStopsMutation(
      stops.map((item) => item.scheduled_stop_point_id),
    );
    await hasuraApi(mutation).then((res) => logOnError('Removing stops', res));
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    const db = getDbConnection(e2eDatabaseConfig);
    await removeVehicleSubmodeOnInfraLink(
      db,
      vehicleSubmodeOnInfrastructureLink,
    ).then((res: ExplicitAny) =>
      logOnError('Removing vehicle submodes on infra links', res),
    );
    db.destroy();
  }
  if (infraLinks) {
    const mutation = mapToDeleteInfraLinksMutation(
      infraLinks.map((item) => item.infrastructure_link_id),
    );
    await hasuraApi(mutation).then((res) =>
      logOnError('Removing infra links', res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation = mapToDeleteInfraLinksAlongRouteMutation(
      infraLinksAlongRoute.map((item) => item.infrastructure_link_id),
    );
    await hasuraApi(mutation).then((res) =>
      logOnError('Removing infra links along route', res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToDeleteJourneyPatternsMutation(
      journeyPatterns.map((item) => item.journey_pattern_id),
    );
    await hasuraApi(mutation).then((res) =>
      logOnError('Removing journey patterns', res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToDeleteStopsInJourneyPatternMutation(
      stopsInJourneyPattern.map((item) => item.journey_pattern_id),
    );
    await hasuraApi(mutation).then((res) =>
      logOnError('Removing stops in journey pattern', res),
    );
  }
};
