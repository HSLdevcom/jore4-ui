export class StopTableRow {
  getOpenViaModalButton = () => {
    return cy.getByTestId('stopActionsDropdown::openViaModal');
  };

  shouldExist = (label: string) => {
    cy.getByTestId('routeStopsRow::label').contains(label).should('exist');
  };

  shouldNotExist = (label: string) => {
    cy.getByTestId('routeStopsRow::label').contains(label).should('not.exist');
  };

  openActionsMenu = (label: string) => {
    cy.getByTestId(`stopActionsDropdown::${label}`).click();
  };

  checkCreateViaModalButtonText = () => {
    this.getOpenViaModalButton().contains('Tee pysäkistä via-piste');
  };

  checkEditViaModalButtonText = () => {
    this.getOpenViaModalButton().contains('Muuta via-tietoa');
  };

  addToRoute = () => {
    cy.getByTestId('stopActionsDropdown::add').click();
  };

  removeFromRoute = () => {
    cy.getByTestId('stopActionsDropdown::remove').click();
  };

  openViaModal = () => {
    this.getOpenViaModalButton().click();
  };

  shouldBeViaPlace = (label: string) => {
    cy.getByTestId(`routeStopsRow::viaIcon::${label}`).should('exist');
  };

  shouldNotBeViaPlace = (label: string) => {
    cy.getByTestId(`routeStopsRow::viaIcon::${label}`).should('not.exist');
  };
}
