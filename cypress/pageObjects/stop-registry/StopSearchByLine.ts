export class StopSearchByLine {
  getActiveLineName() {
    return cy.getByTestId('StopSearchByLine::line::name');
  }

  getActiveLineValidity() {
    return cy.getByTestId('StopSearchByLine::line::validity');
  }

  getRouteContainer(id: string) {
    return cy.getByTestId(`StopSearchByLine::route::${id}`);
  }

  getRouteInfoContainer(id: string) {
    return cy.getByTestId(`StopSearchByLine::route::infoContainer::${id}`);
  }

  getRouteLabel() {
    return cy.getByTestId('StopSearchByLine::route::label');
  }

  getRouteDirection() {
    return cy.getByTestId('StopSearchByLine::route::direction');
  }

  getRouteName() {
    return cy.getByTestId('StopSearchByLine::route::name');
  }

  getRouteValidity() {
    return cy.getByTestId('StopSearchByLine::route::validity');
  }

  getRouteLocatorButton() {
    return cy.getByTestId('StopSearchByLine::route::locatorButton');
  }
}
