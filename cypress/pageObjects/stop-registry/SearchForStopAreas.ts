export class SearchForStopAreas {
  getStopAreaLabel() {
    return cy.getByTestId('StopAreaSearch::label');
  }

  getLocatorButton() {
    return cy.getByTestId('StopAreaSearch::locatorButton');
  }
}
