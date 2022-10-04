import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export interface RouteFormInfo {
  finnishName: string;
  label: string;
  direction: RouteDirectionEnum;
  line: string;
}

export interface OriginValues {
  finnishName: string;
  finnishNameShort: string;
  swedishName: string;
  swedishNameShort: string;
}

export interface DestinationValues {
  finnishName: string;
  finnishNameShort: string;
  swedishName: string;
  swedishNameShort: string;
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
    this.selectLine(values.line);
  }

  /** Presses the Edit route modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */

  getOriginNameFinnishInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishNameInput');
  }

  getOriginNameFinnishShortInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishShortNameInput');
  }

  getOriginNameSwedishInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishNameInput');
  }

  getOriginNameSwedishShortInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishShortNameInput');
  }

  getDestinationNameFinnishInput() {
    return cy.getByTestId('TerminusNameInputs::destination::finnishNameInput');
  }

  getDestinationNameFinnishShortInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::finnishShortNameInput',
    );
  }

  getDestinationNameSwedishInput() {
    return cy.getByTestId('TerminusNameInputs::destination::swedishNameInput');
  }

  getDestinationNameSwedishShortInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::swedishShortNameInput',
    );
  }

  fillOriginInputs(originValues: OriginValues) {
    this.getOriginNameFinnishInput().clear().type(originValues.finnishName);
    this.getOriginNameFinnishShortInput()
      .clear()
      .type(originValues.finnishNameShort);
    this.getOriginNameSwedishInput().clear().type(originValues.swedishName);
    this.getOriginNameSwedishShortInput()
      .clear()
      .type(originValues.swedishNameShort);
  }

  fillDestinationInputs(destinationValues: DestinationValues) {
    this.getDestinationNameFinnishInput()
      .clear()
      .type(destinationValues.finnishName);
    this.getDestinationNameFinnishShortInput()
      .clear()
      .type(destinationValues.finnishNameShort);
    this.getDestinationNameSwedishInput()
      .clear()
      .type(destinationValues.swedishName);
    this.getDestinationNameSwedishShortInput()
      .clear()
      .type(destinationValues.swedishNameShort);
  }

  verifyOriginValues(originValues: OriginValues) {
    this.getOriginNameFinnishInput().should(
      'have.value',
      originValues.finnishName,
    );
    this.getOriginNameFinnishShortInput().should(
      'have.value',
      originValues.finnishNameShort,
    );
    this.getOriginNameSwedishInput().should(
      'have.value',
      originValues.swedishName,
    );
    this.getOriginNameSwedishShortInput().should(
      'have.value',
      originValues.swedishNameShort,
    );
  }

  verifyDestinationValues(destinationValues: DestinationValues) {
    this.getDestinationNameFinnishInput().should(
      'have.value',
      destinationValues.finnishName,
    );
    this.getDestinationNameFinnishShortInput().should(
      'have.value',
      destinationValues.finnishNameShort,
    );
    this.getDestinationNameSwedishInput().should(
      'have.value',
      destinationValues.swedishName,
    );
    this.getDestinationNameSwedishShortInput().should(
      'have.value',
      destinationValues.swedishNameShort,
    );
  }

  save(forceAction = false) {
    return cy
      .getByTestId('EditRouteModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
