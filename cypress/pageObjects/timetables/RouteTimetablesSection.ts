import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export class RouteTimetablesSection {
  static getLoader() {
    return cy.getByTestId('LoadingWrapper::loadingRouteTimetables');
  }

  static getRouteSection(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${label}::${direction}`,
    );
  }

  static getRouteSectionHeadingButton(
    label: string,
    direction: RouteDirectionEnum,
  ) {
    return RouteTimetablesSection.getRouteSection(
      label,
      direction,
    ).findByTestId('VehicleServiceTable::headingButton');
  }

  static getVehicleServiceTableByDayType(dayTypeLabel: string) {
    return cy.getByTestId(`VehicleServiceTable::${dayTypeLabel}`);
  }
}
