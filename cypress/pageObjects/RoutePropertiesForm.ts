import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import {
  ChangeValidityForm,
  ChangeValidityFormInfo,
} from './ChangeValidityForm';
import { TerminusNameInputs, TerminusValues } from './TerminusNameInputs';

export interface RouteFormInfo extends ChangeValidityFormInfo {
  finnishName?: string;
  label?: string;
  hiddenVariant?: string;
  direction?: RouteDirectionEnum;
  line?: string;
  terminusInfo?: {
    origin: TerminusValues;
    destination: TerminusValues;
  };
}
export class RoutePropertiesForm {
  terminusNameInputs = new TerminusNameInputs();

  changeValidityForm = new ChangeValidityForm();

  getForm() {
    return cy.get('#route-properties-form');
  }

  getLabelInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::finnishName');
  }

  getHiddenVariantInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::variant');
  }

  selectDirection(direction: RouteDirectionEnum) {
    cy.getByTestId('RoutePropertiesFormComponent::directionDropdown').click();

    switch (direction) {
      case RouteDirectionEnum.Inbound:
        cy.get('li').contains('2 - Keskustaan päin').click();
        break;
      case RouteDirectionEnum.Outbound:
        cy.get('li').contains('1 - Keskustasta pois').click();
        break;
      default:
        break;
    }
  }

  selectLine(name: string) {
    cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
    cy.get('li').contains(name).click();
  }

  fillRouteProperties(values: RouteFormInfo) {
    if (values.finnishName) {
      this.getFinnishNameInput().clear().type(values.finnishName);
    }
    if (values.label) {
      this.getLabelInput().clear().type(values.label);
    }
    if (values.hiddenVariant) {
      this.getHiddenVariantInput().clear().type(values.hiddenVariant);
    }
    if (values.direction) {
      this.selectDirection(values.direction);
    }
    if (values.line) {
      this.selectLine(values.line);
    }

    if (values.terminusInfo) {
      this.terminusNameInputs.fillTerminusNameInputsForm(
        values.terminusInfo.origin,
        values.terminusInfo.destination,
      );
    }

    this.changeValidityForm.fillForm(values);
  }
}
