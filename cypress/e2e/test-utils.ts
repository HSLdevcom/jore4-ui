export const deleteLineByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."line" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

export const deleteRouteByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."route" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};
