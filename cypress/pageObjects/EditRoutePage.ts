import { UUID } from '../types';
import { ConfirmSaveForm } from './ConfirmSaveForm';
import { RoutePropertiesForm } from './RoutePropertiesForm';
import { TerminusNameInputs } from './TerminusNameInputs';

export class EditRoutePage {
  routePropertiesForm = new RoutePropertiesForm();

  terminusNamesInputs = new TerminusNameInputs();

  confirmSaveForm = new ConfirmSaveForm();

  visit(routeid: UUID) {
    cy.visit(`/routes/${routeid}/edit`);
  }

  getSaveRouteButton() {
    return cy.getByTestId('EditRoutePage::saveButton');
  }
}
