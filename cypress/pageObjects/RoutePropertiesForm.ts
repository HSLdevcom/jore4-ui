export class RoutePropertiesForm {
  getForm() {
    return cy.get('#route-properties-form');
  }

  getLabelInput() {
    return cy.getByTestId('routePropertiesForm:label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('routePropertiesForm:finnishName');
  }

  selectDirection(direction: string) {
    cy.getByTestId('routePropertiesForm:direction-dropdown').click();
    cy.get('li').contains(direction).click();
  }

  selectLine(name: string) {
    cy.getByTestId('routePropertiesForm:choose-line-dropdown')
      .click()
      .type(name);

    cy.getByTestId(`chooseLineDropdown::option::${name}`)
      .contains(name)
      .click();
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
    return cy.getByTestId('Modal:saveButton').click({ force: forceAction });
  }
}
