import { UUID } from '../types';
import { ConfirmSaveForm } from './ConfirmSaveForm';
import { RoutePropertiesForm } from './RoutePropertiesForm';
import { TerminusNameInputs } from './TerminusNameInputs';

export class EditRoutePage {
  routePropertiesForm;

  terminusNamesInputs;

  confirmSaveForm;

  constructor() {
    this.routePropertiesForm = new RoutePropertiesForm();
    this.terminusNamesInputs = new TerminusNameInputs();
    this.confirmSaveForm = new ConfirmSaveForm();
  }

  visit(routeid: UUID) {
    cy.visit(`/routes/${routeid}/edit`);
  }

  getSaveRouteButton() {
    return cy.getByTestId('EditRoutePage::saveButton');
  }
}
