export class EditRouteModal {
  /** Presses the Edit route modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    cy.getByTestId('EditRouteModal')
      .findByTestId('EditRouteModal::saveButton')
      .click({ force: forceAction });

    // After save the edit route modal should close
    cy.getByTestId('EditRouteModal').should('not.exist');
  }
}
