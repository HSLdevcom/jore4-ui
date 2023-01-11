import {
  InfraLinkAlongRouteInsertInput,
  InfraLinkInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  mapToCreateInfraLinkAlongRouteMutation,
  mapToCreateInfraLinksMutation,
  mapToCreateJourneyPatternsMutation,
  mapToCreateLinesMutation,
  mapToCreateRoutesMutation,
  mapToCreateStopsMutation,
  mapToCreateStopsOnJourneyPatternMutation,
  mapToCreateTimingPlacesMutation,
  mapToDeleteInfraLinksAlongRouteMutation,
  mapToDeleteInfraLinksMutation,
  mapToDeleteJourneyPatternsMutation,
  mapToDeleteLinesMutation,
  mapToDeleteRoutesMutation,
  mapToDeleteStopsInJourneyPatternMutation,
  mapToDeleteStopsMutation,
  mapToDeleteTimingPlacesMutation,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  TimingPatternTimingPlaceInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseLogger = (message: string, res: any) => {
  if (res.errors) {
    cy.log(`${message}:`, res);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwOnErrorResponse = (message: string, res: any) => {
  if (res.errors) {
    if (res.errors[0].message) {
      throw new Error(
        `Graphql request error when ${message}: ${res.errors[0].message}`,
      );
    }
    if (res.errors[0].extensions.internal.error.message) {
      throw new Error(
        `Graphql request error when ${message}: ${res.errors[0].extensions.internal.error.message}`,
      );
    }
    if (!res.errors[0]) {
      throw new Error(`Graphql request error when ${message}: ${res.errors}`);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleResponse = (message: string, res: any) => {
  throwOnErrorResponse(message, res);
  responseLogger(message, res);
};

interface SupportedResources {
  infraLinks?: InfraLinkInsertInput[];
  vehicleSubmodeOnInfrastructureLink?: VehicleSubmodeOnInfraLinkInsertInput[];
  lines?: LineInsertInput[];
  timingPlaces?: TimingPatternTimingPlaceInsertInput[];
  stops?: StopInsertInput[];
  routes?: RouteInsertInput[];
  infraLinksAlongRoute?: InfraLinkAlongRouteInsertInput[];
  journeyPatterns?: JourneyPatternInsertInput[];
  stopsInJourneyPattern?: StopInJourneyPatternInsertInput[];
}

export const insertToDbHelper = ({
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
  lines,
  timingPlaces,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (infraLinks) {
    cy.task('hasuraApi', mapToCreateInfraLinksMutation(infraLinks)).then(
      (res) => handleResponse('Inserting infra links', res),
    );
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    cy.task(
      'insertVehicleSubmodOnInfraLinks',
      vehicleSubmodeOnInfrastructureLink,
    ).then((res) =>
      handleResponse('Inserting vehicle submodes on infra links', res),
    );
  }
  if (lines) {
    cy.task('hasuraApi', mapToCreateLinesMutation(lines)).then((res) =>
      handleResponse('Inserting lines', res),
    );
  }
  if (timingPlaces) {
    cy.task('hasuraApi', mapToCreateTimingPlacesMutation(timingPlaces)).then(
      (res) => handleResponse('Inserting timing places', res),
    );
  }
  if (stops) {
    cy.task('hasuraApi', mapToCreateStopsMutation(stops)).then((res) =>
      handleResponse('Inserting stops', res),
    );
  }
  if (routes) {
    cy.task('hasuraApi', mapToCreateRoutesMutation(routes)).then((res) =>
      handleResponse('Inserting routes', res),
    );
  }
  if (infraLinksAlongRoute) {
    cy.task(
      'hasuraApi',
      mapToCreateInfraLinkAlongRouteMutation(infraLinksAlongRoute),
    ).then((res) => handleResponse('Inserting infra links along route', res));
  }
  if (journeyPatterns) {
    cy.task(
      'hasuraApi',
      mapToCreateJourneyPatternsMutation(journeyPatterns),
    ).then((res) => handleResponse('Inserting journey patterns', res));
  }
  if (stopsInJourneyPattern) {
    cy.task(
      'hasuraApi',
      mapToCreateStopsOnJourneyPatternMutation(stopsInJourneyPattern),
    ).then((res) => handleResponse('Inserting stops in journey pattern', res));
  }
};

export const removeFromDbHelper = ({
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
  lines,
  timingPlaces,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
}: SupportedResources) => {
  if (routes) {
    cy.task(
      'hasuraApi',
      mapToDeleteRoutesMutation(routes.map((route) => route.route_id)),
    ).then((res) => handleResponse('Removing route', res));
  }
  if (lines) {
    cy.task(
      'hasuraApi',
      mapToDeleteLinesMutation(lines.map((line) => line.line_id)),
    ).then((res) => handleResponse('Removing line', res));
  }
  if (stops) {
    cy.task(
      'hasuraApi',
      mapToDeleteStopsMutation(
        stops.map((item) => item.scheduled_stop_point_id),
      ),
    ).then((res) => handleResponse('Removing stops', res));
  }
  if (vehicleSubmodeOnInfrastructureLink) {
    cy.task(
      'removeVehicleSubmodOnInfraLinks',
      vehicleSubmodeOnInfrastructureLink,
    ).then((res) =>
      responseLogger('Removing vehicle submodes on infra links', res),
    );
  }
  if (infraLinks) {
    cy.task(
      'hasuraApi',
      mapToDeleteInfraLinksMutation(
        infraLinks.map((item) => item.infrastructure_link_id),
      ),
    ).then((res) => handleResponse('Removing infra links', res));
  }
  if (infraLinksAlongRoute) {
    cy.task(
      'hasuraApi',
      mapToDeleteInfraLinksAlongRouteMutation(
        infraLinksAlongRoute.map((item) => item.infrastructure_link_id),
      ),
    ).then((res) => handleResponse('Removing infra links along route', res));
  }
  if (journeyPatterns) {
    cy.task(
      'hasuraApi',
      mapToDeleteJourneyPatternsMutation(
        journeyPatterns.map((item) => item.journey_pattern_id),
      ),
    ).then((res) => handleResponse('Removing journey patterns', res));
  }
  if (stopsInJourneyPattern) {
    cy.task(
      'hasuraApi',
      mapToDeleteStopsInJourneyPatternMutation(
        stopsInJourneyPattern.map((item) => item.journey_pattern_id),
      ),
    ).then((res) => handleResponse('Removing stops in journey pattern', res));
  }
  if (timingPlaces) {
    cy.task(
      'hasuraApi',
      mapToDeleteTimingPlacesMutation(
        timingPlaces.map((timingPlace) => timingPlace.timing_place_id),
      ),
    ).then((res) => handleResponse('Removing timing place', res));
  }
};
