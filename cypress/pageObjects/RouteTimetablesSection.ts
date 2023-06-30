export class RouteTimetablesSection {
  label: string;

  direction: string;

  constructor(label: string, direction: string) {
    this.label = label;
    this.direction = direction;
  }

  get() {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${this.label}::${this.direction}`,
    );
  }

  assertRouteHasNoSchedules() {
    this.get().should('contain', 'Ei vuoroja');
  }
}
