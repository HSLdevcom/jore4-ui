export class RoutePropertiesForm {
    getLabelInput() {
      return cy.get('#label');
    }
  
    getFinnishNameInput() {
      return cy.get('#finnishName');
    }
  
    selectDirection(direction: string) {
      cy.getByTestId('routePropertiesForm:direction-dropdown').click();
      cy.get('li').contains(direction).click();
    }
  
    selectLine(name: string) {
      cy.getByTestId('routePropertiesForm:choose-line-dropdown').click();
      cy.get('li').contains(name).click();
    }

    save(forceAction = false) {
        return cy.getByTestId('modal:saveButton').click({ force: forceAction });
    }
}
  