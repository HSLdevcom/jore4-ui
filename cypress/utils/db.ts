import {
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  TimingPatternTimingPlaceInsertInput,
  mapToCreateInfraLinkAlongRouteMutation,
  mapToCreateJourneyPatternsMutation,
  mapToCreateLinesMutation,
  mapToCreateRoutesMutation,
  mapToCreateStopsMutation,
  mapToCreateStopsOnJourneyPatternMutation,
  mapToCreateTimingPlacesMutation,
  mapToDeleteInfraLinksAlongRouteMutation,
  mapToDeleteJourneyPatternsMutation,
  mapToDeleteLinesMutation,
  mapToDeleteRoutesMutation,
  mapToDeleteStopsInJourneyPatternMutation,
  mapToDeleteStopsMutation,
  mapToDeleteTimingPlacesMutation,
} from '@hsl/jore4-test-db-manager';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseLogger = (message: string, req: any, res: any) => {
  if (res.errors) {
    cy.log(`${message}:`, res, ' Request: ', JSON.stringify(req));
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwOnErrorResponse = (message: string, req: any, res: any) => {
  if (res.errors) {
    const requestBody = JSON.stringify(req);

    let errorBody = '';
    if (!res.errors[0]) {
      errorBody = res.errors;
    } else if (res.errors[0].message) {
      errorBody = res.errors[0].message;
    } else if (res.errors[0].extensions.internal.error.message) {
      errorBody = res.errors[0].extensions.internal.error.message;
    }

    throw new Error(
      `Graphql request error when ${message}:
       ${errorBody}
       Request:
       ${requestBody}`,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleResponse = (message: string, req: any, res: any) => {
  responseLogger(message, req, res);
  throwOnErrorResponse(message, req, res);
};

export interface SupportedResources {
  lines?: LineInsertInput[];
  timingPlaces?: TimingPatternTimingPlaceInsertInput[];
  stops?: StopInsertInput[];
  routes?: RouteInsertInput[];
  infraLinksAlongRoute?: InfraLinkAlongRouteInsertInput[];
  journeyPatterns?: JourneyPatternInsertInput[];
  stopsInJourneyPattern?: StopInJourneyPatternInsertInput[];
}

export const insertToDbHelper = ({
  lines,
  timingPlaces,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (lines) {
    const mutation = mapToCreateLinesMutation(lines);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting lines', mutation, res),
    );
  }
  if (timingPlaces) {
    const mutation = mapToCreateTimingPlacesMutation(timingPlaces);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting timing places', mutation, res),
    );
  }
  if (stops) {
    const mutation = mapToCreateStopsMutation(stops);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting stops', mutation, res),
    );
  }
  if (routes) {
    const mutation = mapToCreateRoutesMutation(routes);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting routes', mutation, res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation =
      mapToCreateInfraLinkAlongRouteMutation(infraLinksAlongRoute);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting infra links along route', mutation, res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToCreateJourneyPatternsMutation(journeyPatterns);
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting journey patterns', mutation, res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToCreateStopsOnJourneyPatternMutation(
      stopsInJourneyPattern,
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Inserting stops in journey pattern', mutation, res),
    );
  }
};

export const removeFromDbHelper = ({
  lines,
  timingPlaces,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (routes) {
    const mutation = mapToDeleteRoutesMutation(
      routes.map((route) => route.route_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing route', mutation, res),
    );
  }
  if (lines) {
    const mutation = mapToDeleteLinesMutation(
      lines.map((line) => line.line_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing line', mutation, res),
    );
  }
  if (stops) {
    const mutation = mapToDeleteStopsMutation(
      stops.map((item) => item.scheduled_stop_point_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing stops', mutation, res),
    );
  }
  if (infraLinksAlongRoute) {
    const mutation = mapToDeleteInfraLinksAlongRouteMutation(
      infraLinksAlongRoute.map((item) => item.infrastructure_link_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing infra links along route', mutation, res),
    );
  }
  if (journeyPatterns) {
    const mutation = mapToDeleteJourneyPatternsMutation(
      journeyPatterns.map((item) => item.journey_pattern_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing journey patterns', mutation, res),
    );
  }
  if (stopsInJourneyPattern) {
    const mutation = mapToDeleteStopsInJourneyPatternMutation(
      stopsInJourneyPattern.map((item) => item.journey_pattern_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing stops in journey pattern', mutation, res),
    );
  }
  if (timingPlaces) {
    const mutation = mapToDeleteTimingPlacesMutation(
      timingPlaces.map((timingPlace) => timingPlace.timing_place_id),
    );
    cy.task('hasuraAPI', mutation).then((res) =>
      handleResponse('Removing timing place', mutation, res),
    );
  }
};
