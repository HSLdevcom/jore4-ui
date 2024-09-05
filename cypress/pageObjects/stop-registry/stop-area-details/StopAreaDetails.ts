export class StopAreaDetails {
  getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  getName = () => cy.getByTestId('StopAreaDetails::name');

  getDescription = () => cy.getByTestId('StopAreaDetails::description');

  getParentStopPlace = () => cy.getByTestId('StopAreaDetails::parentStopPlace');

  getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  getValidityPeriod = () => cy.getByTestId('StopAreaDetails::validityPeriod');
}
