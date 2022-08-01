export class RouteStopsTable {
  toggleShowUnusedStops = () => {
    cy.getByTestId('show-unused-stops-switch').click();
  };

  expandRouteRow = (label: string, direction: 'outbound' | 'inbound') => {
    cy.getByTestId(
      `routeStopsHeaderRow::toggleAccordion::${direction}::${label}`,
    ).click();
  };

  routeRowShouldExist = (label: string, direction: 'outbound' | 'inbound') => {
    cy.getByTestId(
      `routeStopsHeaderRow::toggleAccordion::${direction}::${label}`,
    ).should('exist');
  };

  routeRowShouldNotExist = (
    label: string,
    direction: 'outbound' | 'inbound',
  ) => {
    cy.getByTestId(
      `routeStopsHeaderRow::toggleAccordion::${direction}::${label}`,
    ).should('not.exist');
  };
}
