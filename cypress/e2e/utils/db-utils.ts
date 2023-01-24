export const deleteLineByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."line" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

export const deleteRoutesByLabel = (labels: string[]) => {
  labels.forEach((label) => {
    const query = 'DELETE FROM "route"."route" WHERE label=?';
    cy.task('executeRawDbQuery', { query, bindings: label });
  });
};

export const deleteStopsByLabel = (labels: string[]) => {
  labels.forEach((label) => {
    const query =
      'DELETE FROM "service_pattern"."scheduled_stop_point" WHERE label=?';
    cy.task('executeRawDbQuery', { query, bindings: label });
  });
};

export const deleteTimingPlacesByLabel = (labels: string[]) => {
  labels.forEach((label) => {
    const query = 'DELETE FROM "timing_pattern"."timing_place" WHERE label=?';
    cy.task('executeRawDbQuery', { query, bindings: label });
  });
};

export const selectLineByLabel = (label: string) => {
  const query = 'SELECT * FROM "route"."line" WHERE label=?';
  return cy.task('executeRawDbQuery', { query, bindings: label });
};
