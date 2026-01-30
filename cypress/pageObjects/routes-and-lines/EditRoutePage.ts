import { UUID } from '../../types';
import { ChangeValidityForm } from '../forms/ChangeValidityForm';
import { PriorityForm } from '../forms/PriorityForm';
import { RoutePropertiesForm } from '../forms/RoutePropertiesForm';
import { TerminusNameInputs } from '../forms/TerminusNameInputs';
import { RouteDraftStopsConfirmationDialog } from '../map/RouteDraftStopsConfirmationDialog';
import { ConfirmationDialog } from '../shared-components/ConfirmationDialog';

export class EditRoutePage {
  static routePropertiesForm = RoutePropertiesForm;

  static terminusNamesInputs = TerminusNameInputs;

  static changeValidityForm = ChangeValidityForm;

  static confirmationDialog = ConfirmationDialog;

  static priorityForm = PriorityForm;

  static routeDraftStopsConfirmationDialog = RouteDraftStopsConfirmationDialog;

  static visit(routeid: UUID) {
    cy.visit(`/routes/${routeid}/edit`);
  }

  static getSaveRouteButton() {
    return cy.getByTestId('EditRoutePage::saveButton');
  }

  static getDeleteRouteButton() {
    return cy.getByTestId('EditRoutePage::deleteButton');
  }
}
