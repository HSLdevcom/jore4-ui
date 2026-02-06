import { TimetablePriority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export interface TimetablesImportPriorityFormInfo {
  priority?: TimetablePriority;
}

export class TimetablesImportPriorityForm {
  static getStandardPriorityButton() {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::standardPriorityButton',
    );
  }

  static getDraftPriorityButton() {
    return cy.getByTestId('TimetablesImportPriorityForm::draftPriorityButton');
  }

  static getTemporaryPriorityButton() {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::temporaryPriorityButton',
    );
  }

  static getSpecialDayPriorityButton() {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::specialDayPriorityButton',
    );
  }

  static setAsStandard() {
    return TimetablesImportPriorityForm.getStandardPriorityButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setAsDraft() {
    return TimetablesImportPriorityForm.getDraftPriorityButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setAsTemporary() {
    return TimetablesImportPriorityForm.getTemporaryPriorityButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setPriority(priority: TimetablePriority) {
    switch (priority) {
      case TimetablePriority.Draft:
        TimetablesImportPriorityForm.setAsDraft();
        break;
      case TimetablePriority.Temporary:
        TimetablesImportPriorityForm.setAsTemporary();
        break;
      case TimetablePriority.Standard:
        TimetablesImportPriorityForm.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }

  static assertSelectedPriority(priority: TimetablePriority | undefined) {
    switch (priority) {
      case TimetablePriority.Draft:
        TimetablesImportPriorityForm.getDraftPriorityButton().should(
          'be.checked',
        );
        break;
      case TimetablePriority.Temporary:
        TimetablesImportPriorityForm.getTemporaryPriorityButton().should(
          'be.checked',
        );
        break;
      case TimetablePriority.Standard:
        TimetablesImportPriorityForm.getStandardPriorityButton().should(
          'be.checked',
        );
        break;
      case TimetablePriority.Special:
        TimetablesImportPriorityForm.getSpecialDayPriorityButton().should(
          'be.checked',
        );
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }
}
