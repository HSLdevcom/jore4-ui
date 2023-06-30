import { VehicleServiceTable } from './VehicleServiceTable';

export class RouteTimetablesSection {
  vehicleServiceTable = new VehicleServiceTable();

  getRouteTimetableSection(routeLabel: string, routeDirection: string) {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${routeLabel}::${routeDirection}`,
    );
  }

  getRouteTimetableSectionByDayType(
    routeLabel: string,
    routeDirection: string,
    dayType: string,
  ) {
    return this.getRouteTimetableSection(routeLabel, routeDirection).within(
      () => {
        this.vehicleServiceTable.getHeadingButton().contains(dayType);
      },
    );
  }
}
