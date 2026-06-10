/**
 * Factory function to create a version row page object with a specific test ID prefix
 */
export function createVersionRowPageObject(testIdPrefix: string) {
  return class VersionRow {
    static rows() {
      return cy.get(`[data-test-element-type='${testIdPrefix}'`);
    }

    rows = () => VersionRow.rows();

    static changed() {
      return cy.getByTestId(`${testIdPrefix}::changed`);
    }

    changed = () => VersionRow.changed();

    static changedBy() {
      return cy.getByTestId(`${testIdPrefix}::changedBy`);
    }

    changedBy = () => VersionRow.changedBy();

    static status() {
      return cy.getByTestId(`${testIdPrefix}::status`);
    }

    status = () => VersionRow.status();

    static validityEnd() {
      return cy.getByTestId(`${testIdPrefix}::validityEnd`);
    }

    validityEnd = () => VersionRow.validityEnd();

    static validityStart() {
      return cy.getByTestId(`${testIdPrefix}::validityStart`);
    }

    validityStart = () => VersionRow.validityStart();

    static versionComment() {
      return cy.getByTestId(`${testIdPrefix}::versionComment`);
    }

    versionComment = () => VersionRow.versionComment();

    static locatorButton() {
      return cy.getByTestId('LocatorButton::button');
    }

    locatorButton = () => VersionRow.locatorButton();

    static actionMenu() {
      return cy.getByTestId(`${testIdPrefix}::actionMenu`);
    }

    actionMenu = () => VersionRow.actionMenu();
  };
}
