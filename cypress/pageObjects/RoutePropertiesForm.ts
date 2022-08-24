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

  selectDirection(direction: string) {
    cy.getByTestId('RoutePropertiesFormComponent::directionDropdown').click();
    cy.get('li').contains(direction).click();
  }

  selectLine(name: string) {
    cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
    cy.get('li').contains(name).click();
  }

  fillRouteProperties(values: {
    label: string;
    finnishName: string;
    direction: string;
    line: string;
  }) {
    this.getFinnishNameInput().type(values.finnishName);
    this.getLabelInput().type(values.label);
    this.selectDirection(values.direction);
    this.selectLine(values.line);
  }

  save(forceAction = false) {
    return cy.getByTestId('Modal::saveButton').click({ force: forceAction });
  }
}
