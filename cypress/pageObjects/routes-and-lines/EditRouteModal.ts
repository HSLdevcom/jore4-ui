export class EditRouteModal {
  static save() {
    cy.getByTestId('EditRouteModal')
      .findByTestId('EditRouteModal::saveButton')
      .scrollIntoViewAndClick();

    // After save the edit route modal should close
    cy.getByTestId('EditRouteModal').should('not.exist');
  }
}
