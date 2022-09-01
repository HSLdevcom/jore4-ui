export const deleteLineByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."line" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

export const deleteRouteByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."route" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

export const deleteStopByLabel = (label: string) => {
  const query =
    'DELETE FROM "internal_service_pattern"."scheduled_stop_point" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};
