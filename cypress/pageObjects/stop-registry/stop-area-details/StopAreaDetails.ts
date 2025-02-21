import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';

export class StopAreaDetails {
  edit = new StopAreaDetailsEdit();

  getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  getName = () => cy.getByTestId('StopAreaDetails::name');

  getPrivateCode = () => cy.getByTestId('StopAreaDetails::privateCode');

  getParentStopPlace = () => cy.getByTestId('StopAreaDetails::parentStopPlace');

  getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  getValidityPeriod = () => cy.getByTestId('StopAreaDetails::validityPeriod');
}
