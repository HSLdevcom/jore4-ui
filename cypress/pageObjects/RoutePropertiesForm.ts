import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export interface RouteFormInfo {
  finnishName: string;
  label: string;
  direction: RouteDirectionEnum;
  line?: string;
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
    this.getFinnishNameInput().clear().type(values.finnishName);
    this.getLabelInput().clear().type(values.label);
    this.selectDirection(values.direction);
    if (values.line) {
      this.selectLine(values.line);
    }
  }
}
