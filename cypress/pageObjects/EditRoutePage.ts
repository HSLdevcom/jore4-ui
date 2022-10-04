import { UUID } from '../types';

export class EditRoutePage {
  visit(routeid: UUID) {
    cy.visit(`/routes/${routeid}/edit`);
  }

  getSaveRouteButton() {
    return cy.getByTestId('EditRoutePage::saveButton');
  }
}
