import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export interface RouteFormInfo {
  finnishName: string;
  label: string;
  direction: RouteDirectionEnum;
  line: string;
}

export class RoutePropertiesForm {
  getForm() {
    return cy.get('#route-properties-form');
  }

  getLabelInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::finnishName');
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
    this.getFinnishNameInput().type(values.finnishName);
    this.getLabelInput().type(values.label);
    this.selectDirection(values.direction);
    this.selectLine(values.line);
  }

  /** Presses the Edit route modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditRouteModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
