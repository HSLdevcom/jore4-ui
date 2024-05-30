/**
 * This page object is marked as legacy as the new simpler page object
 * is taking place in pageObjects/timetables/RouteTimetablesSection.ts
 * This constructor class pattern is probably a bit too heavy and we should
 * stick with simpler page objects and using .within() and .findByTestId()
 * methods
 */
export class RouteTimetablesSectionLegacy {
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
