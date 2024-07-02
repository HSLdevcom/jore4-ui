import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export class RouteTimetablesSection {
  getRouteSection(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${label}::${direction}`,
    );
  }

  getRouteSectionHeadingButton(label: string, direction: RouteDirectionEnum) {
    return this.getRouteSection(label, direction).findByTestId(
      'VehicleServiceTable::headingButton',
    );
  }

  getVehicleServiceTableByDayType(dayTypeLabel: string) {
    return cy.getByTestId(`VehicleServiceTable::${dayTypeLabel}`);
  }
}
