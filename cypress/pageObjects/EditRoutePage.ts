import { UUID } from '../types';
import { ChangeValidityForm } from './ChangeValidityForm';
import { RoutePropertiesForm } from './RoutePropertiesForm';
import { TerminusNameInputs } from './TerminusNameInputs';

export class EditRoutePage {
  routePropertiesForm = new RoutePropertiesForm();

  terminusNamesInputs = new TerminusNameInputs();

  changeValidityForm = new ChangeValidityForm();

  visit(routeid: UUID) {
    cy.visit(`/routes/${routeid}/edit`);
  }

  getSaveRouteButton() {
    return cy.getByTestId('EditRoutePage::saveButton');
  }
}
