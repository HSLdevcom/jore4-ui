export class StopSearchByLine {
  static getActiveLineName() {
    return cy.getByTestId('StopSearchByLine::line::name');
  }

  static getActiveLineValidity() {
    return cy.getByTestId('StopSearchByLine::line::validity');
  }

  static getActiveLineAllStopsCount() {
    return cy.getByTestId('StopSearchByLine::line::countAll');
  }

  static getActiveLineInboundStopsCount() {
    return cy.getByTestId('StopSearchByLine::line::countInbound::count');
  }

  static getActiveLineOutboundStopsCount() {
    return cy.getByTestId('StopSearchByLine::line::countOutbound::count');
  }

  static getRouteContainer(id: string) {
    return cy.getByTestId(`StopSearchByLine::route::${id}`);
  }

  static getRouteInfoContainer(id: string) {
    return cy.getByTestId(`StopSearchByLine::route::infoContainer::${id}`);
  }

  static getRouteLabel() {
    return cy.getByTestId('StopSearchByLine::route::label');
  }

  static getRouteDirection() {
    return cy.getByTestId('StopSearchByLine::route::direction');
  }

  static getRouteName() {
    return cy.getByTestId('StopSearchByLine::route::name');
  }

  static getRouteValidity() {
    return cy.getByTestId('StopSearchByLine::route::validity');
  }

  static getRouteLocatorButton() {
    return cy.getByTestId('StopSearchByLine::route::locatorButton');
  }
}
